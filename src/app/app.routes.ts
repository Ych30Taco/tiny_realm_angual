import { Routes } from '@angular/router';
import { Main } from './tab/main/main';
import { Player } from './tab/player/player';
import { Resource } from './tab/resource/resource';
import { Building } from './tab/building/building';
import { Soldier } from './tab/soldier/soldier';
import { TerrainMap } from './tab/terrain-map/terrain-map';
import { Battle } from './tab/battle/battle';
import { DataAdmin } from './tab/data-admin/data-admin';
import { Aitest } from './tab/aitest/aitest';


export const routes: Routes = [
  {
    path: 'main',
    component: Main
  },
  {
    path: 'player',
    component: Player
  },
  {
    path: 'resource',
    component: Resource
  },
  {
    path: 'building',
    component: Building
  },
  {
    path: 'soldier',
    component: Soldier
  },
  {
    path: 'terrainMap',
    component: TerrainMap
  },
  {
    path: 'battle',
    component: Battle
  },
  {
    path: 'dataAdmin',
    component: DataAdmin
  },
  {
    path: 'aitest',
    component: Aitest
  },
  {
    path: '',
    redirectTo: '/main',
    pathMatch: 'full'
  }
];
