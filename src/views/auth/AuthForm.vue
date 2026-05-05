<script setup>
import {ref, watch} from "vue";
import {useRouter} from "vue-router"
import {addUser, addAdmin, checkCode} from "@/api/register.js"
import {getUser, getAdmin} from "@/api/login.js";

const router = useRouter()

const isLogin = ref(true)
const isUser = ref(true)

const name = ref()
const password = ref()
const confirmPassword = ref()
const inviteCode = ref()

const showError = ref(false)
const errorMessage = ref()
let hideErrorTimer = null;
const showSuccess = ref(false)
const successMessage = ref()
let hideSuccessTimer = null;

async function submit() {
  if (isLogin.value) {
    // 登录分支
    if (isUser.value) {
      const judge = await loginUser()
      if (judge) {
        await router.push('/homepage')
      }
    } else {
      const judge = await loginAdmin()
      if (judge) {
        await router.push('/homepage')
      }
    }
  } else {
    // 注册分支
    if (isUser.value) {
      const judge = await registerUser()
      if (judge) {
        isLogin.value = true
      }
    } else {
      const judge = await registerAdmin()
      if (judge) {
        isLogin.value = true
      }
    }
  }
}

// 用户登录逻辑
async function loginUser() {
  const data = {
    name: name.value,
    password: password.value
  }
  try {
    const res = await getUser(data)

    if (res.code) {
      await showSuccessMessage('登录成功！')
      return true
    } else {
      await showErrorMessage(res.msg)
      return false
    }
  } catch (error) {
    await showErrorMessage(error.message)
  } finally {
    await cleanInput()
  }
}

// 用户注册逻辑
async function registerUser() {
  if (password.value !== confirmPassword.value) {
    await showErrorMessage("两次密码输入的不一样！")
    return false
  }
  const data = {
    name: name.value,
    password: password.value
  }
  try {
    const res = await addUser(data);
    if (res.code) {
      await showSuccessMessage(`用户"${name.value}"注册成功！`)
      return true
    } else {
      await showErrorMessage(error.message)
      return false
    }
  } catch (error) {
    await showErrorMessage(error.message)
    return false
  } finally {
    await cleanInput()
  }
}

// 管理员登录逻辑
async function loginAdmin() {
  const data = {
    name: name.value,
    password: password.value
  }
  try {
    const res = await getAdmin(data)
    if (res.code) {
      await showSuccessMessage('登录成功！')
      return true
    } else {
      await showErrorMessage(res.msg)
      return false
    }
  } catch (error) {
    await showErrorMessage(error)
  }
}

async function registerAdmin() {
  // 检测邀请码
  try {
    const res = await checkCode(inviteCode.value)
    if (!res.code) {
      await showErrorMessage(res.msg)
      return false
    }
  } catch (error) {
    await showErrorMessage(error.message)
    return false
  }
  // 判断密码是否一致
  if (password.value !== confirmPassword.value) {
    await showErrorMessage("两次密码输入的不一样！")
    return false
  }
  const data = {
    name: name.value,
    password: password.value
  }
  try {
    const res = await addAdmin(data)
    if (res.code) {
      await showSuccessMessage(`管理员"${name.value}"注册成功！`)
      return true
    } else {
      await showErrorMessage(res.msg)
      return false
    }
  } catch (error) {
    await showErrorMessage(error.message)
    return false
  }
}


async function showErrorMessage(message) {
  // 清除之前的定时器（防止多个同时运行）
  if (hideErrorTimer) {
    clearTimeout(hideErrorTimer);
  }
  errorMessage.value = message;
  showError.value = true;
  // 设置新的定时器
  hideErrorTimer = setTimeout(() => {
    showError.value = false;
    hideErrorTimer = null; // 清空引用
  }, 3000);
}

async function showSuccessMessage(message) {
  if (hideSuccessTimer) {
    clearTimeout(hideSuccessTimer);
  }
  successMessage.value = message;
  showSuccess.value = true;
  hideSuccessTimer = setTimeout(() => {
    showSuccess.value = false;
    hideSuccessTimer = null;
  }, 3000);
}

async function cleanInput() {
  name.value = ''
  password.value = ''
  confirmPassword.value = ''
  inviteCode.value = ''
}

watch(() => isLogin.value, () => {
  cleanInput()
})
watch(() => isUser.value, () => {
  cleanInput()
})
</script>

<template>

  <div class="hero bg-base-200 min-h-screen gap-20">
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
              <legend class="fieldset-legend">options</legend>
              <label class="label justify-center gap-5 text-2xl font-bold">
                <label class="swap justify-start" style="color: #323232">
                  <input v-model="isLogin" type="checkbox"/>
                  <div class="swap-on">Login</div>
                  <div class="swap-off">register</div>
                </label>

                <label class="swap justify-end" style="color: #323232">
                  <input v-model="isUser" type="checkbox"/>
                  <div class="swap-on">User</div>
                  <div class="swap-off">Admin</div>
                </label>
              </label>
            </fieldset>

            <fieldset class="fieldset flex justify-center gap-5" style="flex-direction: column">
              <label class="floating-label">
                <input v-model="name" type="text" placeholder="Name" class="input input-md"/>
                <span class="label" style="font-size: 16px">Name</span>
              </label>

              <label class="floating-label">
                <input v-model="password" type="password" placeholder="Password" class="input input-md"/>
                <span class="label" style="font-size: 16px">Password</span>
              </label>


              <!-- 确认密码字段（带过渡） -->
              <Transition name="fade">
                <label v-if="!isLogin" class="floating-label">
                  <input v-model="confirmPassword" type="password" placeholder="Confirm Password"
                         class="input input-md"/>
                  <span class="label" style="font-size: 16px">Confirm Password</span>
                </label>
              </Transition>

              <!-- 邀请码字段（带过渡） -->
              <Transition name="fade">
                <label v-if="!isUser && !isLogin" class="floating-label">
                  <input v-model="inviteCode" type="password" placeholder="Invite Code" class="input input-md"/>
                  <span class="label" style="font-size: 16px">Invite Code</span>
                </label>
              </Transition>

              <button @click="submit" class="btn btn-neutral mt-4">{{ isLogin ? 'Login' : 'Register' }}</button>
            </fieldset>
          </div>
        </div>

        <div class="text-center lg:text-left">
          <h1 class="text-5xl font-bold">{{ isLogin ? 'Login now!' : 'Register now!' }}</h1>
          <p class="py-6">
            {{ isLogin ? '继续您的分析工作' : '加入我们，让数据说话' }}
            <!--          {{ isLogin ? '很高兴再次见到您！' : '只需一步，开启智能分析体验' }}-->
            <!--          {{ isLogin-->
            <!--            ? '欢迎回来！继续探索实时数据看板，深入挖掘业务增长机会'-->
            <!--            : '立即注册，开启智能数据分析之旅——从海量数据中快速发现关键洞察' }}-->
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* 淡入淡出过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 如果希望高度也平滑变化，可以加上 max-height 过渡（需设置固定或合理的 max-height） */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, max-height 0.3s ease;
  overflow: hidden;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
}

.fade-enter-to,
.fade-leave-from {
  max-height: 100px; /* 根据实际内容高度设置一个足够大的值 */
}
</style>