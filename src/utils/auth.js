export class AuthManager {
    constructor(supabase) {
        this.supabase = supabase;
        this.user = null;
        this.listeners = [];
    }

    async init() {
        const { data: { session } } = await this.supabase.auth.getSession();
        this.user = session?.user || null;

        this.supabase.auth.onAuthStateChange((event, session) => {
            this.user = session?.user || null;
            this.notifyListeners();

            if (event === 'SIGNED_IN') {
                window.location.hash = '#/events';
            } else if (event === 'SIGNED_OUT') {
                window.location.hash = '#/';
            }
        });
    }

    onAuthChange(callback) {
        this.listeners.push(callback);
    }

    notifyListeners() {
        this.listeners.forEach(cb => cb(this.user));
    }

    async signUp(email, password, name) {
        const { data, error } = await this.supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name }
            }
        });
        if (error) throw error;
        return data;
    }

    async signIn(email, password) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    }

    async signOut() {
        const { error } = await this.supabase.auth.signOut();
        if (error) throw error;
    }

    isAuthenticated() {
        return !!this.user;
    }

    getUser() {
        return this.user;
    }
}
