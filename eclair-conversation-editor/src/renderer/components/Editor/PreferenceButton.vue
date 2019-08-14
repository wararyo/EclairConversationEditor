<template>
    <section>
        <button class="open button is-primary is-medium"
            @click="isComponentModalActive = true">
            <b-icon icon="settings"></b-icon>
        </button>

        <b-modal v-on:close="$emit('close', formProps)" :active.sync="isComponentModalActive" has-modal-card>
            <modal-form v-bind="formProps"></modal-form>
        </b-modal>
    </section>
</template>

<script>
    const Store = require('electron-store');
    const store = new Store();

    const ModalForm = {
        template: `
            <form action="">
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Preference</p>
                    </header>
                    <section class="modal-card-body">
                        <b-field label="Project Folder">
                            <b-input
                                v-model="projectPath"
                                placeholder="/Path/To/Your/Project/"
                                required>
                            </b-input>
                        </b-field>
                        <b-checkbox v-model="loadsWithCollapsed">Load conversation with collapsed view</b-checkbox>
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button" type="button" @click="$parent.close()">Cancel</button>
                        <button class="button is-primary" @click="save();$parent.close()">OK</button>
                    </footer>
                </div>
            </form>
        `,
        data: function(){ return {
                projectPath: !store.get('projectPath') ? '' : store.get('projectPath'),
                loadsWithCollapsed: !store.get('loadsWithCollapsed') ? false : store.get('loadsWithCollapsed')
            }
        },
        methods: {
            save() {
                console.log(this.projectPath);
                store.set('projectPath',this.projectPath);
                store.set('loadsWithCollapsed', this.loadsWithCollapsed);
            }
        }
    }

    export default {
        components: {
            ModalForm
        },
        data() {
            return {
                isComponentModalActive: false,
                formProps: {
                    projectPath: store.get('projectPath'),
                    loadsWithCollapsed: store.get('loadsWithCollapsed')
                }
            }
        }
    }
</script>

<style lang="scss">
    .open.button {
        background-color: transparent !important;
    }
</style>