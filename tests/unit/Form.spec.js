import { shallowMount } from "@vue/test-utils";
import Form from "@/components/Form.vue";

describe("初回レンダリング", () => {
  it("【画面】エラーメッセージ（class='error-msg'の要素）が画面に表示されていない", () => {
    const wrapper = shallowMount(Form);

    const errorElement = wrapper.get(".error-msg");
    expect(errorElement.isVisible()).toBe(false);
  });

  it("【画面】誕生日のセレクトボックスで選択されている値が1950年1月1日である", () => {
    const wrapper = shallowMount(Form);

    const selectedYear = wrapper.get("#year").element.value;
    const selectedMonth = wrapper.get("#month").element.value;
    const selectedDay = wrapper.get("#day").element.value;

    expect(selectedYear).toBe("1950");
    expect(selectedMonth).toBe("1");
    expect(selectedDay).toBe("1");
  });

  it("【内部】誕生日のセレクトボックスの値が1950年1月1日である", () => {
    const wrapper = shallowMount(Form);

    const vm = wrapper.vm;
    expect(vm.selectedYear).toBe(1950);
    expect(vm.selectedMonth).toBe(1);
    expect(vm.selectedDay).toBe(1);
  });

  it("【画面】誕生日の日付が31日まで選択可能である", () => {
    const wrapper = shallowMount(Form);

    const options = wrapper.findAll("#day option");
    const lastOptionVal = options[options.length - 1].element.value;
    expect(lastOptionVal).toBe("31");
  });

  it("【内部】誕生日の日付が31日まで選択可能である", () => {
    const wrapper = shallowMount(Form);

    // computedの確認
    const dayList = wrapper.vm.dayList;
    expect(dayList[dayList.length - 1]).toBe(31);
  });

  it("【画面】パスワードの初期値が空文字列である", () => {
    const wrapper = shallowMount(Form);

    const input = wrapper.get("#password");
    expect(input.element.value).toBe("");
  });

  it("【内部】パスワードの初期値が空文字列である", () => {
    const wrapper = shallowMount(Form);

    const passwordVal = wrapper.vm.currentPassword;
    expect(passwordVal).toBe("");
  });

  it("【画面】「認証成功」という文字が表示されていない", () => {
    const wrapper = shallowMount(Form);

    const result = wrapper.get(".result");
    expect(result.text()).not.toContain("認証成功");
  });

  it("【内部】isAuthSuccessがfalse", () => {
    const wrapper = shallowMount(Form);

    expect(wrapper.vm.isAuthSuccess).toBe(false);
  });
});

// セレクトボックスの初期値が1950年2月1日になっていること
const isSelected19500201 = (wrapper) => {
  // 画面の表示
  const selectedYear = wrapper.get("#year").element.value;
  const selectedMonth = wrapper.get("#month").element.value;
  const selectedDay = wrapper.get("#day").element.value;

  expect(selectedYear).toBe("1950");
  expect(selectedMonth).toBe("2");
  expect(selectedDay).toBe("1");

  // 変数の表示
  const vm = wrapper.vm;
  expect(vm.selectedYear).toBe(1950);
  expect(vm.selectedMonth).toBe(2);
  expect(vm.selectedDay).toBe(1);
};

describe("誕生日に「1950年2月1日」が選択されており、パスワードが空文字列の場合", () => {
  it("【画面&内部】誕生日のセレクトボックスで選択されている値が1950年2月1日である", () => {
    const wrapper = shallowMount(Form, {
      data() {
        return {
          selectedMonth: 2,
        };
      },
    });

    isSelected19500201(wrapper);
  });

  it("【画面】エラーメッセージ（class='error-msg'の要素）が画面に表示されていない", () => {
    const wrapper = shallowMount(Form, {
      data() {
        return {
          selectedMonth: 2,
        };
      },
    });

    // 1950年2月1日が選択されていること
    isSelected19500201(wrapper);

    // エラーメッセージが非表示であることを確認
    const errorElement = wrapper.get(".error-msg");
    expect(errorElement.isVisible()).toBe(false);
  });

  it("【画面】誕生日の日付の31日が選択できない（表示されていない）", () => {
    const wrapper = shallowMount(Form, {
      data() {
        return {
          selectedMonth: 2,
        };
      },
    });

    // 1950年2月1日が選択されていること
    isSelected19500201(wrapper);

    // 画面の確認
    const options = wrapper.findAll("#day option");
    const lastOptionVal = options[options.length - 1].element.value;
    expect(lastOptionVal).not.toBe("31");
  });

  it("【内部】誕生日の日付の31日が選択できない（表示されていない）", () => {
    const wrapper = shallowMount(Form, {
      data() {
        return {
          selectedMonth: 2,
        };
      },
    });

    // 1950年2月1日が選択されていること
    isSelected19500201(wrapper);

    // computedの確認
    const dayList = wrapper.vm.dayList;
    expect(dayList[dayList.length - 1]).not.toBe(31);
  });

  it("【画面】submitイベントを発火させると、「パスワードを入力してください」と表示される", async () => {
    const wrapper = shallowMount(Form, {
      data() {
        return {
          selectedMonth: 2,
        };
      },
    });

    // 1950年2月1日が選択されていること
    isSelected19500201(wrapper);

    // submit
    await wrapper.get("form").trigger("submit");

    const displayErrorMsg = wrapper.get(".password .error-msg").text();
    expect(displayErrorMsg).toBe("パスワードを入力してください");
  });

  it("【内部】submitイベントを発火させると、「パスワードを入力してください」というエラーメッセージが格納される", () => {
    const wrapper = shallowMount(Form, {
      data() {
        return {
          selectedMonth: 2,
        };
      },
    });

    // 1950年2月1日が選択されていること
    isSelected19500201(wrapper);

    // submit
    wrapper.get(".submit-btn button").trigger("submit");

    // エラーメッセージの検証
    expect(wrapper.vm.passwordErrorMsg).toBe("パスワードを入力してください");
  });

  it("【画面】パスワードに「123」と入力してsubmitイベントを発火させると、「パスワードが短すぎます」と表示される", async () => {
    const wrapper = shallowMount(Form, {
      data() {
        return {
          selectedMonth: 2,
        };
      },
    });

    // 1950年2月1日が選択されていること
    isSelected19500201(wrapper);

    const input = wrapper.get("#password");
    await input.setValue("123");
    await wrapper.get("form").trigger("submit");

    const displayErrorMsg = wrapper.get(".password .error-msg").text();
    expect(displayErrorMsg).toBe("パスワードが短すぎます");
  });

  it("【内部】パスワードに「123」と入力してsubmitイベントを発火させると、「パスワードが短すぎます」というエラーメッセージが格納される", async () => {
    const wrapper = shallowMount(Form, {
      data() {
        return {
          selectedMonth: 2,
        };
      },
    });

    // 1950年2月1日が選択されていること
    isSelected19500201(wrapper);

    const input = wrapper.get("#password");
    await input.setValue("123");
    await wrapper.get("form").trigger("submit");

    expect(wrapper.vm.passwordErrorMsg).toBe("パスワードが短すぎます");
  });

  it("【画面】パスワードに「1234」と入力してsubmitイベントを発火させると、「誕生日が違います」と表示される", async () => {
    const wrapper = shallowMount(Form, {
      data() {
        return {
          selectedMonth: 2,
        };
      },
    });

    // 1950年2月1日が選択されていること
    isSelected19500201(wrapper);

    const input = wrapper.get("#password");
    await input.setValue("1234");
    await wrapper.get("form").trigger("submit");

    const birthdayErrorMsg = wrapper.get(".birtyday .error-msg").text();
    expect(birthdayErrorMsg).toBe("誕生日が違います");
  });

  it("【内部】パスワードに「1234」と入力してsubmitイベントを発火させると、「誕生日が違います」というエラーメッセージが格納される", async () => {
    const wrapper = shallowMount(Form, {
      data() {
        return {
          selectedMonth: 2,
        };
      },
    });

    // 1950年2月1日が選択されていること
    isSelected19500201(wrapper);

    const input = wrapper.get("#password");
    await input.setValue("1234");
    await wrapper.get("form").trigger("submit");

    expect(wrapper.vm.birthdayErrorMsg).toBe("誕生日が違います");
  });
});

// セレクトボックスの初期値が2021年1月1日になっていること
const isSelected20210101 = (wrapper) => {
  // 画面の表示
  const selectedYear = wrapper.get("#year").element.value;
  const selectedMonth = wrapper.get("#month").element.value;
  const selectedDay = wrapper.get("#day").element.value;

  expect(selectedYear).toBe("2021");
  expect(selectedMonth).toBe("1");
  expect(selectedDay).toBe("1");

  // 変数の表示
  const vm = wrapper.vm;
  expect(vm.selectedYear).toBe(2021);
  expect(vm.selectedMonth).toBe(1);
  expect(vm.selectedDay).toBe(1);
};
describe("誕生日に「2021年1月1日」が選択されており、パスワードが空文字列の場合", () => {
  it("【画面&内部】誕生日のセレクトボックスで選択されている値が2021年1月1日である", () => {
    const wrapper = shallowMount(Form, {
      data() {
        return {
          selectedYear: 2021,
        };
      },
    });

    // 2021年1月1日が選択されていること
    isSelected20210101(wrapper);
  });

  it("【画面】パスワードに「1234」と入力してsubmitイベントを発火させると、「パスワードが違います」と表示される", async () => {
    const wrapper = shallowMount(Form, {
      data() {
        return {
          selectedYear: 2021,
        };
      },
    });

    // 2021年1月1日が選択されていること
    isSelected20210101(wrapper);

    const input = wrapper.get("#password");
    await input.setValue("1234");
    await wrapper.get("form").trigger("submit");

    const displayErrorMsg = wrapper.get(".password .error-msg").text();
    expect(displayErrorMsg).toBe("パスワードが違います");
  });

  it("【内部】パスワードに「1234」と入力してsubmitイベントを発火させると、「パスワードが違います」というエラーメッセージが格納される", async () => {
    const wrapper = shallowMount(Form, {
      data() {
        return {
          selectedYear: 2021,
        };
      },
    });

    // 2021年1月1日が選択されていること
    isSelected20210101(wrapper);

    const input = wrapper.get("#password");
    await input.setValue("1234");
    await wrapper.get("form").trigger("submit");

    expect(wrapper.vm.passwordErrorMsg).toBe("パスワードが違います");
  });

  it("【画面】パスワードに「12345」と入力してsubmitイベントを発火させると、「認証成功」と表示される", async () => {
    const wrapper = shallowMount(Form, {
      data() {
        return {
          selectedYear: 2021,
        };
      },
    });

    // 2021年1月1日が選択されていること
    isSelected20210101(wrapper);

    const input = wrapper.get("#password");
    await input.setValue("12345");
    await wrapper.get("form").trigger("submit");

    const resultTxt = wrapper.get(".result").text();
    expect(resultTxt).toBe("認証成功");
  });

  it("【内部】パスワードに「12345」と入力してsubmitイベントを発火させると、isAuthSuccessがtrueになる", async () => {
    const wrapper = shallowMount(Form, {
      data() {
        return {
          selectedYear: 2021,
        };
      },
    });

    // 2021年1月1日が選択されていること
    isSelected20210101(wrapper);

    const input = wrapper.get("#password");
    await input.setValue("12345");
    await wrapper.get("form").trigger("submit");

    expect(wrapper.vm.isAuthSuccess).toBe(true);
  });
});
