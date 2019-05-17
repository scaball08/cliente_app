import { BrowserModule } from '@angular/platform-browser';
import { NgModule,LOCALE_ID } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent} from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { FormComponent } from './clientes/form.component';

import { ClienteService } from './clientes/cliente.service';
import { RouterModule, Routes} from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

// PARA registrar el idioma de la fecha o moneda en toda la aplicacion:
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from "@angular/material";
import {  MatMomentDateModule } from "@angular/material-moment-adapter";
import { DetalleComponent } from './clientes/detalle/detalle.component';
import { LoginComponent } from './usuarios/login.component';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';
import { TokenInterceptor } from './usuarios/interceptors/token.interceptor';
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';

// the second parameter 'fr' is optional
registerLocaleData(localeEs);

const routes: Routes = [
  {path: '', redirectTo: '/clientes', pathMatch: 'full'},
  {path: 'directivas', component: DirectivaComponent},
  {path: 'clientes', component: ClientesComponent},
  {path: 'clientes/page/:page', component: ClientesComponent},
  {path: 'clientes/form', component: FormComponent,canActivate:[AuthGuard , RoleGuard], data:{role:'ROLE_ADMIN'} }, // se añade el guar que creamos donde verificamos si se ha autenticado
  {path: 'clientes/form/:id', component: FormComponent,canActivate:[AuthGuard , RoleGuard], data:{role:'ROLE_ADMIN'} }, // Se coloca los parametros que recibira el guard RoleGuard , data:{role:'ROLE_ADMIN'
  {path: 'login', component: LoginComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SweetAlert2Module.forRoot(),
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatMomentDateModule
  ],
  providers: [ClienteService,
    {provide: LOCALE_ID, useValue: 'es' }, // se coloca el mismo que se coloco en el localeEs de '@angular/common/locales/es';
  {provide: HTTP_INTERCEPTORS, useClass : TokenInterceptor ,multi :true} , // REgistrando el interceptor en nuestra applicacion
  {provide: HTTP_INTERCEPTORS, useClass : AuthInterceptor ,multi :true} ,
],
  bootstrap: [AppComponent]
})
export class AppModule { }
