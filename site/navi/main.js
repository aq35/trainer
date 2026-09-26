// 1画面1操作のナビ（setup.html / git.html …）の入口。
import { mount } from 'sunao';
import NaviApp from './NaviApp.sunao';

mount(NaviApp, document.getElementById('app'));
