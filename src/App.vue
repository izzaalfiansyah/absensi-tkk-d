<template>
	<v-app>
		<v-app-bar
			fixed
			:color="dark ? 'primary darken-1' : 'primary'"
			dark
		>
			<v-toolbar-title>TKK D ({{ this.app.lesson }})</v-toolbar-title>

			<v-spacer></v-spacer>

			<v-switch
				@click="toggleTheme"
				v-model="dark"
				color="white"
				hide-details
			>
				<template v-slot:label>
					<v-icon v-if="dark">mdi-weather-night</v-icon>
					<v-icon v-else>mdi-weather-sunny</v-icon>
				</template>
			</v-switch>
		</v-app-bar>
		
		<div class="pa-4 mt-12">
			<v-container>
				<router-view class="mt-4"></router-view>
			</v-container>
		</div>

		<v-snackbar v-model="snackbar.status" :color="snackbar.color" :timeout="2000" dark>
			{{ snackbar.text }}
			<v-btn text dark @click="snackbar.status = false">X</v-btn>
		</v-snackbar>
	</v-app>
</template>

<script>
	import db from '@/plugins/db.js'

	export default {
		data() {
			return {
				snackbar: {
					status: false,
					text: '',
					color: 'red'
				},
				app: {},
				dark: false
			}
		},
		created() {
			this.$root.$refs.notif = this.notif
			this.getApp()
			this.checkTheme()
		},
		methods: {
			getApp() {
				(async () => {
					const { data, error } = await db.from('app').select('*')
					this.app = data[0]
				})()
			},
			checkTheme() {
				const theme = localStorage.getItem('xdark') ? true : false
				this.dark = theme
				this.$vuetify.theme.dark = theme
			},
			toggleTheme() {
				!this.dark ? localStorage.removeItem('xdark') : localStorage.setItem('xdark', true)
				this.checkTheme()
			},
			notif(error, text) {
				this.snackbar = {
					status: true,
					text: text,
					color: error ? 'red' : 'green'
				}
			}
		}
	}
</script>