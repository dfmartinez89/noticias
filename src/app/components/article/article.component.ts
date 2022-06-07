import { Component, Input, OnInit } from '@angular/core';
import { Article } from 'src/app/interfaces';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {
  @Input() article: Article;
  @Input() index: number;

  constructor(
    private iab: InAppBrowser,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController
  ) {}

  openArticle() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      const browser = this.iab.create(this.article.url);
      browser.show();
      return;
    }
    window.open(this.article.url, '_blank');
  }

  async onOpenMenu() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Options',
      buttons: [
        {
          text: 'Share',
          icon: 'share-outline',
          handler: () => this.onShareArticle(),
        },

        {
          text: 'Favorite',
          icon: 'heart-outline',
          handler: () => this.onToggleFavorite(),
        },
        {
          text: 'Cancel',
          icon: 'close-outline',
          role: 'cancel',
          cssClass: 'secondary',
        },
      ],
    });
    await actionSheet.present();
  }

  onShareArticle() {
    console.log('Share article');
  }

  onToggleFavorite() {
    console.log('Toggle favorite');
  }
}
