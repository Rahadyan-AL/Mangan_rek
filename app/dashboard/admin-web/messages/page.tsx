"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Mail, Eye } from "lucide-react";
import { toast } from "sonner";

type Message = {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
};

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
            const response = await fetch(`${baseUrl}/api/contact`, {
                credentials: "include"
            });
            const result = await response.json();
            if (result.success || Array.isArray(result.data) || Array.isArray(result)) {
                setMessages(result.data || result);
            } else {
                toast.error("Gagal memuat pesan");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan jaringan saat memuat pesan");
        } finally {
            setIsLoading(false);
        }
    };

    const deleteMessage = async (id: string) => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
            const response = await fetch(`${baseUrl}/api/contact/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            const result = await response.json();
            if (response.ok || result.success) {
                setMessages(messages.filter(msg => msg.id !== id));
                toast.success("Pesan berhasil dihapus");
            } else {
                toast.error(result.message || "Gagal menghapus pesan");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan jaringan saat menghapus pesan");
        } finally {
            setDeleteConfirmId(null);
        }
    };

    const getSubjectAndMessage = (fullMessage: string) => {
        if (fullMessage.startsWith('Subjek: ')) {
            const parts = fullMessage.split('\n\n');
            const subject = parts[0].replace('Subjek: ', '').trim();
            const message = parts.slice(1).join('\n\n').trim();
            return { subject, message };
        }
        return { subject: 'Pesan', message: fullMessage };
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <section className="mx-auto w-full max-w-6xl px-6 py-8 md:px-10 md:py-10">
                <header className="mb-8">
                    <h1 className="text-2xl font-semibold">Pesan Masuk</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Kelola pesan dari form Contact Us
                    </p>
                </header>

                <Card className="border border-border">
                    <CardHeader>
                        <CardTitle className="text-lg">Daftar Pesan</CardTitle>
                        <CardDescription>
                            Pesan yang dikirimkan oleh pengunjung website.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <p className="text-sm text-muted-foreground">Memuat pesan...</p>
                        ) : messages.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Belum ada pesan yang masuk.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Status</TableHead>
                                            <TableHead>Pengirim</TableHead>
                                            <TableHead className="min-w-[300px]">Pesan</TableHead>
                                            <TableHead>Waktu</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {messages.map((msg) => (
                                            <TableRow key={msg.id} className="font-medium">
                                                <TableCell>
                                                    <Mail className="h-4 w-4 text-primary" />
                                                </TableCell>
                                                <TableCell>
                                                    <div>{msg.name}</div>
                                                    <div className="text-xs text-muted-foreground font-normal">{msg.email}</div>
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    <span className="font-semibold text-slate-800 line-clamp-1">
                                                        {getSubjectAndMessage(msg.message).subject}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {new Date(msg.createdAt).toLocaleDateString('id-ID', { 
                                                        day: 'numeric', month: 'short', year: 'numeric',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            onClick={() => setSelectedMessage(msg)}
                                                            title="Lihat Detail Pesan"
                                                            className="flex items-center gap-1.5"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                            <span>Detail</span>
                                                        </Button>
                                                        <Button 
                                                            variant="destructive" 
                                                            size="icon" 
                                                            onClick={() => setDeleteConfirmId(msg.id)}
                                                            title="Hapus Pesan"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>

            {/* View Detail Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-lg border border-border bg-background/95 shadow-2xl animate-in zoom-in-95 duration-200">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Mail className="h-5 w-5 text-primary" />
                                Detail Pesan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1 rounded-lg border border-border/50 bg-muted/30 p-3">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pengirim</p>
                                    <p className="font-medium text-foreground">{selectedMessage.name}</p>
                                </div>
                                <div className="space-y-1 rounded-lg border border-border/50 bg-muted/30 p-3">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tanggal</p>
                                    <p className="font-medium text-foreground">
                                        {new Date(selectedMessage.createdAt).toLocaleDateString('id-ID', { 
                                            day: 'numeric', month: 'short', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-1 rounded-lg border border-border/50 bg-muted/30 p-3">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</p>
                                <p className="font-medium text-foreground">{selectedMessage.email}</p>
                            </div>
                            <div className="space-y-1 rounded-lg border border-border/50 bg-muted/30 p-3">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subjek</p>
                                <p className="font-semibold text-foreground">{getSubjectAndMessage(selectedMessage.message).subject}</p>
                            </div>
                            <div className="space-y-2 rounded-lg border border-border/50 bg-primary/5 p-4">
                                <p className="text-xs font-semibold text-primary uppercase tracking-wider">Isi Pesan</p>
                                <div className="max-h-[250px] overflow-y-auto pr-2">
                                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                                        {getSubjectAndMessage(selectedMessage.message).message}
                                    </p>
                                </div>
                            </div>
                            <div className="pt-2 flex justify-end">
                                <Button onClick={() => setSelectedMessage(null)} className="w-full">
                                    Tutup
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-sm border border-border bg-background/95 shadow-2xl animate-in zoom-in-95 duration-200">
                        <CardHeader className="pb-4 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <CardTitle className="text-xl">Hapus Pesan?</CardTitle>
                            <CardDescription className="text-center mt-2">
                                Apakah Anda yakin ingin menghapus pesan ini? Tindakan ini tidak dapat dibatalkan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-3 justify-center">
                            <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirmId(null)}>
                                Batal
                            </Button>
                            <Button variant="destructive" className="flex-1" onClick={() => deleteMessage(deleteConfirmId)}>
                                Hapus
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </main>
    );
}
