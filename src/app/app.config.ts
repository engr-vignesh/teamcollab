import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { LucideAngularModule, Layout, LayoutDashboard, List, Plus, Search, Filter, LogIn, LogOut, Moon, Sun, Trash2, ChevronRight, Clock, User, Users, AlertCircle, BarChart2, CheckCircle, ThumbsUp, Inbox, HelpCircle, Menu, Settings, SlidersHorizontal, ArrowUpDown, X, Pencil } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      LucideAngularModule.pick({
        Layout, LayoutDashboard, List, Plus, Search, Filter, LogIn, LogOut, Moon, Sun, Trash2, ChevronRight, Clock, User, Users, AlertCircle, BarChart2, CheckCircle, ThumbsUp, Inbox, HelpCircle, Menu, Settings, SlidersHorizontal, ArrowUpDown, X, Pencil
      })
    )
  ]
};
