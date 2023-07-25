<template>
  <form @submit.prevent="submitForm">
    <div class="birtyday">
      <label>誕生日</label>
      <div class="selected-area">
        <select id="year" v-model="selectedYear">
          <option
            v-for="year in birthdayList.yearList"
            :key="year"
            :value="year"
          >
            {{ year }}
          </option>
        </select>
        年
        <select id="month" v-model="selectedMonth">
          <option
            v-for="month in birthdayList.monthList"
            :key="month"
            :value="month"
          >
            {{ month }}
          </option>
        </select>
        月
        <select id="day" v-model="selectedDay">
          <option v-for="day in dayList" :key="day" :value="day">
            {{ day }}
          </option>
        </select>
        日
        <span v-show="showBirthdayErrorMsg" class="error-msg">{{
          birthdayErrorMsg
        }}</span>
      </div>
    </div>

    <div class="password">
      <label>パスワード</label>
      <div class="input-area">
        <input type="password" id="password" v-model="currentPassword" />
        <span v-show="showPasswordErrorMsg" class="error-msg">{{
          passwordErrorMsg
        }}</span>
      </div>
    </div>

    <div class="submit-btn">
      <button type="submit">認証する</button>
    </div>
  </form>

  <div class="result">
    {{ isAuthSuccess ? "認証成功" : "" }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 認証が通る組み合わせ
      whiteList: { password: "12345", birthday: "20210101" },
      // 入力フォームの日付候補
      birthdayList: {
        yearList: [],
        monthList: [],
        dayList: [],
      },
      // 現在の値
      selectedYear: 1950,
      selectedMonth: 1,
      selectedDay: 1,
      currentPassword: "",
      // エラーメッセージ関連
      showBirthdayErrorMsg: false,
      showPasswordErrorMsg: false,
      passwordErrorMsg: "",
      birthdayErrorMsg: "",
      // 認証結果
      isAuthSuccess: false,
    };
  },
  created() {
    // 年
    for (let i = 1950; i <= 2021; i++) {
      this.birthdayList.yearList.push(i);
    }

    // 月
    for (let i = 1; i <= 12; i++) {
      this.birthdayList.monthList.push(i);
    }

    // 日
    for (let i = 1; i <= 31; i++) {
      this.birthdayList.dayList.push(i);
    }
  },
  methods: {
    submitForm() {
      this.isAuthSuccess = false;
      if (this.currentPassword.length === 0) {
        this.passwordErrorMsg = "パスワードを入力してください";
        this.showPasswordErrorMsg = true;
        return;
      } else {
        this.showPasswordErrorMsg = false;
      }

      if (this.currentPassword.length < 4) {
        this.passwordErrorMsg = "パスワードが短すぎます";
        this.showPasswordErrorMsg = true;
        return;
      } else {
        this.showPasswordErrorMsg = false;
      }

      const year = String(this.selectedYear);
      const month = String(this.selectedMonth).padStart(2, "0");
      const day = String(this.selectedDay).padStart(2, "0");
      const birthday = year + month + day;
      if (birthday !== this.whiteList.birthday) {
        this.birthdayErrorMsg = "誕生日が違います";
        this.showBirthdayErrorMsg = true;
        return;
      } else {
        this.showBirthdayErrorMsg = false;
      }

      if (this.currentPassword !== this.whiteList.password) {
        this.passwordErrorMsg = "パスワードが違います";
        this.showPasswordErrorMsg = true;
        return;
      } else {
        this.showPasswordErrorMsg = false;
      }

      this.isAuthSuccess = true;
    },
  },
  computed: {
    dayList() {
      const day30List = [2, 4, 6, 9, 11];
      const days = this.birthdayList.dayList;
      if (day30List.includes(this.selectedMonth)) {
        days.pop();
      }

      return days;
    },
  },
};
</script>

<style scoped>
form {
  width: 230px;
  margin: auto;
  text-align: left;
  box-sizing: border-box;
}

form > div[class] {
  margin-top: 20px;
}

form label + div[class] {
  margin-top: 4px;
}

select {
  padding: 4px;
}

input[type="password"] {
  width: 100%;
  padding: 4px;
}

.submit-btn {
  text-align: center;
}

.submit-btn button {
  padding: 4px 8px;
  border-radius: 5px;
  border: 1px solid #555;
}

.error-msg {
  color: #a00;
  font-size: 13px;
}
</style>
