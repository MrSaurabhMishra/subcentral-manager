import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight, Mail } from "lucide-react";

const countries = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "Japan", "Brazil", "Mexico",
  "South Korea", "Italy", "Spain", "Netherlands", "Sweden",
];

type View = "signIn" | "signUp" | "forgot";

const Auth = () => {
  const { signIn, signUp, resetPassword } = useAuth();
  const [view, setView] = useState<View>("signIn");
  const [showPw, setShowPw] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [country, setCountry] = useState("India");

  const handleSignIn = () => {
    if (!email || !password) { toast.error("Please fill all fields."); return; }
    if (signIn(email, password)) {
      toast.success("Welcome back! 🎉");
    } else {
      toast.error("Invalid email or password.");
    }
  };

  const handleSignUp = () => {
    if (!name || !email || !password || !confirmPw) { toast.error("Please fill all fields."); return; }
    if (password !== confirmPw) { toast.error("Passwords don't match."); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    if (signUp(name, email, password, country)) {
      toast.success("Account created! Welcome to SubCentral 🚀");
    } else {
      toast.error("An account with this email already exists.");
    }
  };

  const handleForgot = () => {
    if (!email) { toast.error("Enter your email address."); return; }
    if (resetPassword(email)) {
      toast.success("Password reset instructions sent to your email!");
      setView("signIn");
    } else {
      toast.error("No account found with this email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl mb-4">
            SC
          </div>
          <h1 className="text-2xl font-bold tracking-tight">SubCentral</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your subscriptions smarter</p>
        </div>

        <Card className="glass-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-center">
              {view === "signIn" && "Sign In"}
              {view === "signUp" && "Create Account"}
              {view === "forgot" && "Reset Password"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div key={view} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                {view === "signUp" && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Full Name</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs">Email</Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>

                {view !== "forgot" && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Password</Label>
                    <div className="relative">
                      <Input
                        type={showPw ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPw(!showPw)}
                      >
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {view === "signUp" && (
                  <>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Confirm Password</Label>
                      <Input
                        type="password"
                        value={confirmPw}
                        onChange={e => setConfirmPw(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Country</Label>
                      <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {view === "signIn" && (
                  <>
                    <Button className="w-full gap-2" onClick={handleSignIn}>
                      Sign In <ArrowRight className="h-4 w-4" />
                    </Button>
                    <div className="flex justify-between text-xs">
                      <button className="text-primary hover:underline" onClick={() => setView("forgot")}>Forgot password?</button>
                      <button className="text-primary hover:underline" onClick={() => setView("signUp")}>Create account</button>
                    </div>
                  </>
                )}

                {view === "signUp" && (
                  <>
                    <Button className="w-full gap-2" onClick={handleSignUp}>
                      Create Account <ArrowRight className="h-4 w-4" />
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Already have an account?{" "}
                      <button className="text-primary hover:underline" onClick={() => setView("signIn")}>Sign in</button>
                    </p>
                  </>
                )}

                {view === "forgot" && (
                  <>
                    <p className="text-xs text-muted-foreground">Enter your email and we'll send reset instructions.</p>
                    <Button className="w-full gap-2" onClick={handleForgot}>
                      <Mail className="h-4 w-4" /> Send Reset Link
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      <button className="text-primary hover:underline" onClick={() => setView("signIn")}>Back to sign in</button>
                    </p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
