<template>
    <v-app>
        <v-navigation-drawer app class="elevation-2" v-model="sidebar.open">
            <template v-slot:prepend>
                <v-list-item two-line class="py-1">
                    <v-list-item-avatar>
                        <img src="https://randomuser.me/api/portraits/women/81.jpg" />
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>Jane Smith</v-list-item-title>
                        <v-list-item-subtitle class="text-sm">Logged In</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </template>

            <v-divider></v-divider>

            <v-list dense>
                <v-subheader>MAIN MENU</v-subheader>
                <v-list-item-group v-model="sidebar.selectedItem" color="primary">
                    <v-list-item v-for="(item, i) in sidebar.items" :key="i" @click="() => handlePage(item.path)">
                        <v-list-item-icon>
                            <v-icon v-text="item.icon"></v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title v-text="item.title"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar color="primary accent-4" dark app>
            <v-app-bar-nav-icon @click="toggleSidebar"></v-app-bar-nav-icon>

            <v-toolbar-title>VUETIFY</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-menu left bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item v-for="n in 5" :key="n" @click="() => {}">
                        <v-list-item-title>Option {{ n }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>

        <v-main class="grey lighten-5">
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
export default {
    data() {
        return {
            sidebar: {
                open: true,
                selectedItem: 0,
                items: [
                    { title: 'Home', icon: 'mdi-home-city', path: '/' },
                    { title: 'About', icon: 'mdi-cog', path: '/about' },
                    { title: 'Login', icon: 'mdi-login', path: '/login' },
                    { title: 'Logout', icon: 'mdi-logout', path: 'logout' }
                ]
            },
			darkMode: false
        }
    },
    methods: {
        toggleSidebar() {
            this.sidebar.open = !this.sidebar.open
        },
        handlePage(path) {
            if (path == 'logout') {
				window.location = '/logout'
			} else {
				this.$router.push(path)
			}
        }
    }
}
</script>
