"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Mail, MailOpen } from "lucide-react";

type Message = {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    date: string;
    read: boolean;
};

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load messages from localStorage
        const loadedMessages = JSON.parse(localStorage.getItem("adminMessages") || "[]");
        setMessages(loadedMessages);
        setIsLoading(false);
    }, []);

    const toggleReadStatus = (id: string) => {
        const updatedMessages = messages.map(msg => 
            msg.id === id ? { ...msg, read: !msg.read } : msg
        );
        setMessages(updatedMessages);
        localStorage.setItem("adminMessages", JSON.stringify(updatedMessages));
    };

    const deleteMessage = (id: string) => {
        const updatedMessages = messages.filter(msg => msg.id !== id);
        setMessages(updatedMessages);
        localStorage.setItem("adminMessages", JSON.stringify(updatedMessages));
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
                                            <TableHead>Subjek</TableHead>
                                            <TableHead className="min-w-[300px]">Pesan</TableHead>
                                            <TableHead>Waktu</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {messages.map((msg) => (
                                            <TableRow key={msg.id} className={msg.read ? "opacity-75 bg-muted/50" : "font-medium"}>
                                                <TableCell>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"
                                                        onClick={() => toggleReadStatus(msg.id)}
                                                        title={msg.read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                                                    >
                                                        {msg.read ? <MailOpen className="h-4 w-4 text-muted-foreground" /> : <Mail className="h-4 w-4 text-primary" />}
                                                    </Button>
                                                </TableCell>
                                                <TableCell>
                                                    <div>{msg.name}</div>
                                                    <div className="text-xs text-muted-foreground font-normal">{msg.email}</div>
                                                </TableCell>
                                                <TableCell>{msg.subject}</TableCell>
                                                <TableCell className="text-sm whitespace-pre-wrap">{msg.message}</TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {new Date(msg.date).toLocaleDateString('id-ID', { 
                                                        day: 'numeric', month: 'short', year: 'numeric',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button 
                                                        variant="destructive" 
                                                        size="icon" 
                                                        onClick={() => deleteMessage(msg.id)}
                                                        title="Hapus Pesan"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
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
        </main>
    );
}
