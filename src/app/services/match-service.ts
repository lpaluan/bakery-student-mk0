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
    const { data, error } = await this.supabase
      .from('matches_attended')
      .select(
        '*, users(full_name, email, teams(name)), matches(matchdatetime, opponent)'
      )
      .order('matches(matchdatetime)', { ascending: true });

    if (error) {
      alert(error.message);
      throw error;
    }

    return data;
  }

  async listMatchesTeam() {
    const { data, error } = await this.supabase
      .from('matches_attendedbyteam')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      alert(error.message);
      throw error;
    }

    return data;
  }

  nextMatch() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const data = this.supabase
      .from('matches')
      .select('*')
      .gte('matchdatetime', now.toISOString())
      .order('matchdatetime', { ascending: true })
      .limit(1)
      .single();
    return data;
  }

  lastMatch() {
    const now = new Date();
    now.setHours(23, 59, 59, 0);
    const data = this.supabase
      .from('matches')
      .select('*')
      .lte('matchdatetime', now.toISOString())
      .order('matchdatetime', { ascending: false })
      .limit(1)
      .single();
    return data;
  }

  async insertMatchAttendance(user_id: string, match_id: string) {
    const testData = {
      user_id: user_id,
      match_id: match_id,
    };
    const { data, error } = await this.supabase
      .from('matches_attended')
      .insert(testData);
    return error;
  }

  getMatches() {
    const data = this.supabase
      .from('matches')
      .select('*')
      .order('matchdatetime', { ascending: true });
    return data;
  }
}
