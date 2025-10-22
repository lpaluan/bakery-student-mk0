import { inject, Injectable, NgZone } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { LoginPayload, SignupPayload } from '../type/auth-type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  supabase!: SupabaseClient;
  private router = inject(Router);
  private _ngZone = inject(NgZone);

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    this.supabase.auth.onAuthStateChange((event, session) => {
      localStorage.setItem('session', JSON.stringify(session?.user));

      if (session?.user) {
        this._ngZone.run(() => {
          this.router.navigate(['/dashboard']);
        });
      }
    });
  }

  get isLoggedIn(): boolean {
    const user = localStorage.getItem('session') as string;
    return user === 'undefined' ? false : true;
  }

  async signInWithGoogle() {
    await this.supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  }

  async signInWithEmail(payload: LoginPayload) {
    return await this.supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });
  }

  async signUpWithEmail(payload: SignupPayload, isAdmin?: boolean, isReader?: boolean) {
    const adminSignup = isAdmin ?? false;
    const readerSignup = isReader ?? false;

    const authResponse = await this.supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          displayName: payload.name,
        },
      },
    });

    if (authResponse.error || !authResponse.data.user) {
      return authResponse;
    } 


    return await this.supabase
      .from('users')
      .update({ admin: isAdmin, reader: isReader })
      .eq('id', authResponse.data.user.id);
  }

  async signOut() {
    await this.supabase.auth.signOut();
  }

  async getCurrentUserId(): Promise<string> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error || !data.user) return '';
    return data.user.id;
  }

  async getUserInfo(id: string) {
    const data = await this.supabase
      .from('users')
      .select('*, teams(id, name)')
      .eq('id', id)
      .single();
    return data;
  }

  getUserTeamId(id: string) {
    const data = this.supabase.from('teams').select().eq('id', id).single();
    return data;
  }

  getTeams() {
    const data = this.supabase.from('teams').select('*').order('id', { ascending: true });
    return data;
  }

  updateUser(id: string, full_name: string, phone: string, team: string) {
    return this.supabase
      .from('users')
      .update({ full_name: full_name, phone: phone, team: team })
      .eq('id', id);
  } 
}
