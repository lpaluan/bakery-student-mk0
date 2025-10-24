import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatchService } from '../../services/match-service';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { CdkTableModule } from '@angular/cdk/table';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortHeader, MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-matches-query',
  templateUrl: './matches-query.html',
  styleUrl: './matches-query.css',
  imports: [
    MatInputModule,
    MatLabel,
    MatTableModule,
    CdkTableModule,
    MatSortModule,
    MatSelectModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class MatchesQuery implements OnInit {
  baseDisplayedColumns: string[] = ['full_name', 'team', 'datereg'];
  displayedColumns: string[] = this.baseDisplayedColumns.slice();
  dataSource = new MatTableDataSource<any>();
  completeDataSource = new MatTableDataSource<any>();
  private match_service = inject(MatchService);
  matches: any[] = [];
  selectedMatch: string = '';
  @ViewChild('matchTbSort') sort = new MatSort();

  async ngOnInit() {
    const data = await this.match_service.listMatches();

    const formatted = data.map((match: any) => ({
      match_id: match.match_id,
      matchdatetime: match.matches?.matchdatetime,
      opponent: match.matches?.opponent,
      full_name: match.users?.full_name,
      team: match.users?.teams?.name,
      datereg: match.created_at,
    }));
    this.completeDataSource.data = formatted;
    this.dataSource.data = this.completeDataSource.data;
    this.dataSource.sort = this.sort;
    this.loadMatches();
  }

  async loadMatches() {
    const { data, error } = await this.match_service.getMatches();
    if (!error) {
      this.matches = data;
      this.matches.unshift({ id: '', opponent: 'All Matches' });
      this.loadLastMatch();
    }
  }

   async loadLastMatch() {
    const { data } = await this.match_service.lastMatch();
    this.selectedMatch = data.id;
    this.dataSource.filter = this.selectedMatch.trim().toLowerCase();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyMatchFilter() {
    this.displayedColumns = this.baseDisplayedColumns.slice();
    if (this.selectedMatch) {
      this.dataSource.data = this.completeDataSource.data.filter(
        (item) => item.match_id === this.selectedMatch
      );
    } else {
      this.displayedColumns.push('opponent');
      this.displayedColumns.push('matchdatetime');
      this.dataSource.data = this.completeDataSource.data;
    }
    this.dataSource.sort = this.sort;
  }

  exportToCSV() {
    const csvData = this.convertToCSV(this.dataSource.filteredData);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  convertToCSV(data: any[]): string {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((row) => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  }
}
