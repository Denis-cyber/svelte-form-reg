<script>
  export let isPlayerAgree = false;
</script>

<div class="item-form checkbox">
  <input type="checkbox" bind:checked={isPlayerAgree} id="agree" />
  <label class="text-agree" for="agree"
    >Мне больше 21 года, я соглашаюсь с правилами ООО "СТАТУСКВО" и Политикой обработки персональных
    данных, а также на получение рекламных и информационных рассылок.</label
  >
</div>
