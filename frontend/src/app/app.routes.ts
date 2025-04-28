import { Routes } from '@angular/router';

// Importar tus componentes
import { HomeComponent } from './pages/home/home.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { PrestamosComponent } from './pages/prestamos/prestamos.component';
import { DevolucionesComponent } from './pages/devoluciones/devoluciones.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Home (default)
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'prestamos', component: PrestamosComponent },
  { path: 'devoluciones', component: DevolucionesComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: '**', redirectTo: '' } // Cualquier ruta no válida redirige a Home
];
