import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NewsResponse, Article } from '../interfaces';
import { map } from 'rxjs/operators';

const apiKey = environment.apiKey;

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private http: HttpClient) {}

  getTopHeadLines(): Observable<Article[]> {
    return this.http
      .get<NewsResponse>(
        `https://newsapi.org/v2/top-headlines?country=us&category=sports`,
        {
          params: {
            apiKey,
          },
        }
      )
      .pipe(map((resp) => resp.articles)); //pipe obtains and modifies the response data
    //map(({articles}) => articles) -> same as above
  }
}
