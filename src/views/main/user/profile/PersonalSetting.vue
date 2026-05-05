<script setup>
import {ref} from "vue";

const showError = ref(false)
const showSuccess = ref(false)

const name = ref()
const password = ref()
const confirmPassword = ref()


function submit() {
    console.log('submit')
}
</script>

<template>

    <div class="hero gap-20">
        <div class="hero-content flex-col gap-10">

            <div v-if="showError" role="alert" class="alert alert-error alert-soft shadow-2xl">
                <span>{{ errorMessage }}</span>
            </div>

            <div v-if="showSuccess" role="alert" class="alert alert-success alert-soft shadow-2xl">
                <span>{{ successMessage }}</span>
            </div>

            <div class="hero-content flex-row max-w-200 gap-10">

                <div class="text-5xl font-bold card bg-base-100 w-full max-w-80 shrink-0 shadow-2xl">
                    <div class="card-body flex-col gap-5">
                        <fieldset class="fieldset bg-base-100 border-base-300 rounded-box w-68 border p-4">
                            <legend class="fieldset-legend">Tips</legend>
                            <label class="label justify-center gap-5 text-2xl font-bold">
                                Please complete
                            </label>
                        </fieldset>

                        <fieldset class="fieldset flex justify-center gap-5" style="flex-direction: column">
                            <label class="floating-label">
                                <input v-model="name" type="text" placeholder="Name" class="input input-md"/>
                                <span class="label" style="font-size: 16px">Name</span>
                            </label>

                            <label class="floating-label">
                                <input v-model="password" type="password" placeholder="Password"
                                       class="input input-md"/>
                                <span class="label" style="font-size: 16px">Password</span>
                            </label>

                            <label class="floating-label">
                                <input v-model="confirmPassword" type="password" placeholder="Confirm Password"
                                       class="input input-md"/>
                                <span class="label" style="font-size: 16px">Confirm Password</span>
                            </label>

                            <button @click="submit" class="btn btn-neutral mt-4">Revise</button>
                        </fieldset>
                    </div>
                </div>

                <div class="text-center lg:text-left">
                    <h1 class="text-5xl font-bold">Modify information</h1>
                    <p class="py-6">
                        修改您的信息，留空则不修改
                    </p>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.main {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 100px;
}
</style>