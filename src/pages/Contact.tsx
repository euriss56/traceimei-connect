import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft, Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Contact() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [sujet, setSujet] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message envoyé avec succès ! Nous vous répondrons sous 48h.");
    setNom(""); setEmail(""); setSujet(""); setMessage("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="benin-stripe" />
      <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="font-heading font-bold text-xl text-foreground">TraceIMEI-BJ</span>
          </Link>
          <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-8">Contactez-nous</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Vous avez une question, un problème technique ou une suggestion ? L'équipe TraceIMEI-BJ est à votre disposition.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Adresse</p>
                  <p className="text-sm text-muted-foreground">GETECH — Groupe d'Études en Technologies et Informatique<br />Cotonou, Bénin</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">contact@traceimei-bj.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Téléphone</p>
                  <p className="text-sm text-muted-foreground">+229 XX XX XX XX</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-4">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Horaires :</strong> Lundi – Vendredi, 8h00 – 18h00 (GMT+1)<br />
                <strong className="text-foreground">Délai de réponse :</strong> 24 à 48 heures ouvrées
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom complet</Label>
              <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Votre nom" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sujet">Sujet</Label>
              <Input id="sujet" value={sujet} onChange={(e) => setSujet(e.target.value)} placeholder="Objet de votre message" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Décrivez votre demande..." rows={5} required />
            </div>
            <Button type="submit" variant="hero" className="w-full">
              <Send className="h-4 w-4 mr-2" /> Envoyer le message
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
