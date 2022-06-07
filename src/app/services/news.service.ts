import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  NewsResponse,
  Article,
  ArticlesByCategoryAndPage,
} from '../interfaces';
import { map } from 'rxjs/operators';

const apiKey = environment.apiKey;
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private articlesByCategoryAndPage: ArticlesByCategoryAndPage = {};

  constructor(private http: HttpClient) {}

  getTopHeadLines(): Observable<Article[]> {
    return this.getTopHeadlinesByCategory('sports');
  }

  getTopHeadlinesByCategory(
    category: string,
    loadMore: boolean = false
  ): Observable<Article[]> {
    if (loadMore) {
      return this.getArticlesByCategory(category);
    }
    if (this.articlesByCategoryAndPage[category]) {
      return of(this.articlesByCategoryAndPage[category].articles);
    }
    return this.getArticlesByCategory(category);
  }

  private executeQuery<NewsResponse>(endpoint: string) {
    return this.http.get<NewsResponse>(`${apiUrl}${endpoint}`, {
      params: { apiKey, country: 'us' },
    });
  }

  private getArticlesByCategory(category: string): Observable<Article[]> {
    //if there are no article, set page = 0
    if (!Object.keys(this.articlesByCategoryAndPage).includes(category)) {
      this.articlesByCategoryAndPage[category] = {
        page: 0,
        articles: [],
      };
    }
    //if there are already articles, increase page by one
    const page = this.articlesByCategoryAndPage[category].page + 1;
    //make the call
    return this.executeQuery<NewsResponse>(
      `/top-headlines?category=${category}&page=${page}`
    ).pipe(
      //pipe obtains and modifies the response data
      map(({ articles }) => {
        if (articles.length === 0) {
          return this.articlesByCategoryAndPage[category].articles;
        }
        this.articlesByCategoryAndPage[category] = {
          page,
          articles: [
            ...this.articlesByCategoryAndPage[category].articles,
            ...articles,
          ],
        };
        return this.articlesByCategoryAndPage[category].articles;
      })
    );
  }
}
