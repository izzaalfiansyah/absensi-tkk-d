<template>
    <div>
        <v-card>
            <div class="pa-3">
                <v-data-table
                    :headers="[
                        {
                            text: 'Nama',
                            value: 'name',
                        },
                        {
                            text: 'Waktu Absen',
                            value: 'created_at',
                        },
                        {
                            text: 'Status',
                            value: 'status',
                            sortable: false,
                        },
                    ]"
                    :items="allData"
                    :items-per-page="10"
                    :search="datatable.search"
                    :loading="allData.length ? false : true"
                >
                    <template v-slot:top>
                        <v-row align="center">
                            <v-col cols="12" lg="6">
                                <v-card-title>Data Absen Mahasiswa</v-card-title>
                            </v-col>
                            <v-col cols="12" lg="6">
                                <v-text-field v-model="datatable.search" label="Cari nama mahasiswa" class="mx-4" append-icon="mdi-magnify"></v-text-field>
                            </v-col>
                        </v-row>
                    </template>

                    <template v-slot:item.status="{ item }">
                        <v-btn v-if="item.created_at != 'Tidak tersedia'" color="primary" small class="white--text">Hadir</v-btn>
                        <v-btn
                            @click="
                                () => {
                                    req = item;
                                    modal.create = true;
                                }
                            "
                            v-else
                            color="red"
                            small
                            class="white--text"
                        >
                            Belum Absen
                        </v-btn>
                    </template>
                </v-data-table>
            </div>

            <v-dialog v-model="modal.create" max-width="500px">
                <v-card>
                    <v-form ref="form" @submit.prevent="absen">
                        <v-card-title>Absen Hadir</v-card-title>
                        <v-card-text>
                            <p>Untuk mengkonfirmasi bahwa ini adalah benar-benar diri anda. Silahkan masukan NIM anda!</p>
                            <v-text-field label="NIM" placeholder="E322xxxxx" :rules="[(v) => !!v || 'NIM harus diisi', (v) => !(v ? v.length != 9 : false) || 'panjang NIM harus 9 karakter']" counter="9" v-model="nim"></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn text color="red" @click="modal.create = false">Batal</v-btn>
                            <v-btn type="submit" text color="primary">Konfirmasi</v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-dialog>
        </v-card>

        <v-card class="mt-4">
            <v-card-title>Reset Data Absensi</v-card-title>

            <v-card-text>
                <p>Peringatan! Melakukan reset data absensi akan menghilangkan seluruh data mahasiswa yang telah absen. Data mahasiswa akan kembali menjadi belum absen secara keseluruhan!</p>
                <v-btn color="red" dark @click="modal.reset = true" class="mt-2">Reset Data</v-btn>
            </v-card-text>

            <v-dialog v-model="modal.reset" max-width="450px">
                <v-card>
                    <v-form ref="resetForm" @submit.prevent="reset">
                        <v-card-title>Reset Data</v-card-title>
                        <v-card-text>
                            <p>Anda yakin untuk mereset seluruh data absensi mahasiswa? Silahkan masukkan kode token untuk mengkonfirmasi bahwa diri anda adalah admin aplikasi</p>

                            <v-text-field v-model="token" label="Kode Token" placeholder="xxxxxxxxx" :rules="[(v) => !!v || 'kode token harus diisi', (v) => !(v != 'superadmin-tkk-21') || 'kode token yang anda masukkan salah']"></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn text color="red" @click="modal.reset = false">Batal</v-btn>
                            <v-btn text color="blue" type="submit">Konfirmasi</v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-dialog>
        </v-card>
    </div>
</template>

<script>
    import db from '../plugins/db.js';

    export default {
        layout: 'default',
        data() {
            return {
                students: [],
                datatable: {
                    search: '',
                },
                modal: {
                    create: false,
                    reset: false,
                },
                req: {},
                nim: '',
                token: '',
            };
        },
        created() {
            this.get();
        },
        methods: {
            get() {
                this.req = {};
                this.students = [];
                this.nim = '';
                this.token = '';
                setTimeout(() => {
                    (async () => {
                        const { data, error } = await db.from('students').select('*, presence(*)');
                        this.students = data;
                    })();
                }, 400);
            },
            absen() {
                if (this.$refs.form.validate()) {
                    (async () => {
                        if (this.nim == this.req.nim) {
                            await db.from('presence').insert([{ student_id: this.req.id, created_at: this.time }]);
                            this.modal.create = false;
                            this.$root.$refs.notif(false, 'Absensi kehadiran berhasil dilakukan');
                            const name = this.req.name;
                            this.get();
                            this.datatable.search = name;
                        } else {
                            this.$root.$refs.notif(true, 'NIM yang anda masukkan salah');
                        }
                    })();
                }
            },
            reset() {
                if (this.$refs.resetForm.validate()) {
                    (async () => {
                        await db.from('presence').delete();
                        this.$root.$refs.notif(false, 'Data absensi berhasil direset');
                        this.modal.reset = false;
                        this.get();
                    })();
                }
            },
        },
        computed: {
            allData() {
                let data = [];

                this.students.forEach((item) => {
                    data.push({
                        id: item.id,
                        nim: item.nim,
                        name: item.name,
                        created_at: item.presence.length ? item.presence[0].created_at : 'Tidak tersedia',
                    });
                });

                return data;
            },
            time() {
                const date = new Date();

                var time = date.getHours().toString().length > 1 ? date.getHours() : '0' + date.getHours();
                time += ':' + (date.getMinutes().toString().length > 1 ? date.getMinutes() : '0' + date.getMinutes());
                time += ':' + (date.getSeconds().toString().length > 1 ? date.getSeconds() : '0' + date.getSeconds());

                return time;
            },
        },
    };
</script>
