// 読み物と目次（index.html）の入口。docsify の代わりに、sunao で描く。
import { mount } from 'sunao';
import ReadApp from './ReadApp.sunao';

mount(ReadApp, document.getElementById('app'));
