import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private supabase!: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async insertMatch(opponent: string) {
    try {
      const { data, error } = await this.supabase
        .from('matches')
        .insert({ opponent });

      if (error) {
        alert(error.message);
      }
    } catch (error) {
      alert(error);
    }
  }

  async listMatches() {
    try {
      const { data, error } = await this.supabase.from('matches').select();

      if (error) {
        alert(error.message);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async nextMatch() {
      const now = new Date();
      now.setHours(0,0,0,0);
      const data = this.supabase
      .from('matches')
      .select('*')
      .gte('matchdatetime', now.toISOString())
      .order('matchdatetime', { ascending: true })
      .single();
      return data;
  }

}
