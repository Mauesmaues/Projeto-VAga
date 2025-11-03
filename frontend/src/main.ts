import { createApp } from 'vue';
import App from '../src/App.vue';
import router from './router';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

const vuetify = createVuetify({
	components,
	directives,
	icons: {
		defaultSet: 'mdi',
	},
	theme: {
		defaultTheme: 'customLight',
		themes: {
			customLight: {
				dark: false,
				colors: {
					primary: '#1976D2',
					secondary: '#42A5F5',
					accent: '#2196F3',
					background: '#F5F7FA',
					surface: '#FFFFFF',
					'surface-variant': '#E3F2FD',
					error: '#EF5350',
					success: '#66BB6A',
					warning: '#FFA726',
					info: '#42A5F5',
				},
			},
		},
	},
});

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.mount('#app');
