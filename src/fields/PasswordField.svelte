<script>
  export const password = {};

  import successIcon from '../assets/icons/success_icon.svg';
  import errorIcon from '../assets/icons/error_icon.svg';

  let validationRules = [
    {
      title: 'password is too long (more than 128 characters)',
      regex: '.{129,}$',
      isValid: false,
      exception: true,
    },
    {
      title: 'at least 6 symbols',
      regex: '^.{6,}$',
      isValid: false,
    },
    {
      title: 'at least 1 digit (0-9)',
      regex: '[0-9]+',
      isValid: false,
    },
    {
      title: 'at least 1 character (a-z)',
      regex: '[a-zA-Zа-яА-Я]+',
      isValid: false,
    },
  ];

  $: displayBlockRules = false;
  $: isPasswordSatisfied = false;

  function checkRulesCompliancy(password) {
    return validationRules.map((rule) => {
      const matherRegex = new RegExp(rule.regex);
      const isValid = matherRegex.test(password);

      return {
        ...rule,
        isValid,
      };
    });
  }

  function areRulesSatisfied(ruleResults) {
    const isException = ruleResults
      .filter((rule) => rule.exception)
      .every(({ isValid }) => !isValid);

    if (!isException) return false;

    const allAreValid = ruleResults
      .filter((rule) => !rule.exception)
      .every(({ isValid }) => isValid);

    return allAreValid;
  }

  function handleInputPas(event) {
    const compliancyResult = checkRulesCompliancy(event.target.value);
    validationRules = compliancyResult;
    isPasswordSatisfied = areRulesSatisfied(compliancyResult);

    if (event.target.value.length === 0) {
      password.message = '';
      password.valid = false;
      return;
    }

    if (!isPasswordSatisfied) {
      displayBlockRules = true;
      password.valid = false;
      password.message = 'Невалидный пароль';
    } else {
      password.valid = true;
      password.message = 'Пароль валидный';
      displayBlockRules = false;
    }
  }

  function handleChangePas() {
    displayBlockRules = false;

    if (password.value.length === 0) {
      return (password.message = '');
    }

    if (!isPasswordSatisfied) {
      return (password.message = 'Невалидный пароль');
    }
  }
</script>

<div class="item-form">
  <div class="item-name">
    <span class="field-title">Пароль</span>
  </div>
  <input
    type="password"
    name="password"
    class={password.message?.length > 0 && !isPasswordSatisfied
      ? 'item-field error-validation-pas'
      : 'item-field'}
    bind:value={password.value}
    on:input={(e) => handleInputPas(e)}
    on:change={handleChangePas}
    on:focus={() => (displayBlockRules = true)}
    on:blur={() => (displayBlockRules = false)}
  />

  {#if password.message && !displayBlockRules}
    <span class={isPasswordSatisfied ? 'message-pas-success' : 'message-pas-error'}
      >{password.message}</span
    >
  {/if}

  {#if displayBlockRules}
    <div class="block-rules">
      {#each validationRules as rule}
        {#if rule.exception && rule.isValid}
          <div class="rule-content">
            <div class="rule-icon">
              <img src={errorIcon} alt="error-icon" />
            </div>
            <span class="rule-text error-length">{rule.title}</span>
          </div>
        {/if}
        {#if !rule.exception}
          <div class="rule-content">
            <div class="rule-icon">
              {#if rule.isValid}
                <img src={successIcon} alt="success-icon" />
              {:else if !rule.isValid}
                <div>•</div>
              {/if}
            </div>
            <span class={rule.isValid ? 'rule-text success' : 'rule-text'}>{rule.title}</span>
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>
