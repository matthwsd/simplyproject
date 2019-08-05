import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { FnamePipe } from './fname.pipe';

import { NavbarComponent } from './components/navbar/navbar.component';

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MusicCreateComponent } from './components/musics/musics-create/musics.component';
import { ProjectorComponent } from './components/projector/projector.component';
import { FilesComponent } from './components/files/files.component';
import { PresentationsComponent } from './components/presentations/presentations.component';
import { MusicsSelectComponent } from './components/musics/musics-select/musics-select.component';
import { SettingsProjectionComponent } from './components/settings/settings-projection/settings-projection.component';
import { OnlyNumberDirective } from './directives/only-number.directive';
import { ToastrComponent } from './toastr/toastr.component';
import { LiveComponent } from './components/live/live.component';
import { BibleComponent } from './components/bible/bible.component';
import { HelpComponent } from './components/help/help.component';
import { PreviewComponent } from './components/preview/preview.component';
import { SettingsGeneralComponent } from './components/settings/settings-general/settings-general.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    FnamePipe,
    NavbarComponent,
    MusicCreateComponent,
    ProjectorComponent,
    FilesComponent,
    PresentationsComponent,
    MusicsSelectComponent,
    SettingsProjectionComponent,
    OnlyNumberDirective,
    ToastrComponent,
    LiveComponent,
    BibleComponent,
    HelpComponent,
    PreviewComponent,
    SettingsGeneralComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [ElectronService],
  bootstrap: [AppComponent],
  entryComponents: [
    MusicCreateComponent,
    MusicsSelectComponent,
    SettingsProjectionComponent,
    ToastrComponent,
    BibleComponent,
    HelpComponent
  ]
})
export class AppModule { }
