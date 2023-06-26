// ASCII
// [32, 47],[58, 64],[91,96],[123, 126]: special char
// [48, 57]: 0-9
// [65, 90]: A-Z
// [97, 122]: a-z

export function random(min, max) {
  const _min = Math.min(min, max);
  const _max = Math.max(min, max);
  return Math.floor(Math.random() * (_max - _min)) + _min;
}

export function range(min, max) {
  const _min = Math.min(min, max);
  const _max = Math.max(min, max);
  return (new Array(_max - _min)).fill(_min).map((_, index) => _ + index);
}

/**
 * Generate string from the RegExp gene
 * @param {*} regExp RegExp
 * @param {*} option.max default max length of result string
 * @returns string generated from RegExp gene
 */
export function gene(regExp, option = { max: 20 }) {
  const { max } = option;
  let regExpString = regExp.toString().slice(1, -1);

  // redundancy parentheses regular expression
  const rePaRegExp = /(?<!\\)\([^(|)]*(?<!\\)\)/;
  // or regular expression
  const orRegExp = /([^()]+)((?<!\\)\|([^()]+))/;
  let rePaMatch = null;
  let orMatch = null;
  while ((rePaMatch = regExpString.match(rePaRegExp)) || (orMatch = regExpString.match(orRegExp))) {
    if (rePaMatch) {
      const [m_content] = rePaMatch;
      regExpString = regExpString.replace(m_content, m_content.slice(1, -1));
    }
    if (orMatch) {
      const [m_content] = orMatch;
      const orItems = m_content.split('\|');
      regExpString = regExpString.replace(m_content, orItems[random(0, orItems.length)]);
    }
  }

  return regExpString
    .replaceAll(
      /((\\[.bBdDsSwW)])|((?<!\\)\[.+(?<!\\)\])|((?<!\\)\((.*?)(?<!\\)\))|(.))(((?<!\\)[\+\?\*])|((?<!\\)\{(\d*)(,?)(\d*)(?<!\\)\}))/g,
      (match, m_content,
        m_slashed_keyword, m_choice_group, m_any_word_wrapper, m_any_word, m_any_char,
        m_quantifier_wrapper, m_single_quantifier, m_range_wrapper, m_min, m_comma, m_max
      ) => {
        let repeatTimes = 0;
        // console.log(m_quantifier_wrapper, m_single_quantifier, m_range_wrapper, m_min, m_comma, m_max);
        if (m_single_quantifier && m_range_wrapper
          || m_range_wrapper && !m_min
        ) {
          throw new Error('Error RexExp');
        } else if (m_single_quantifier) {
          switch (m_single_quantifier) {
            case '*':
              repeatTimes = random(0, max);
              break; 
            case '+':
              repeatTimes = random(1, max);
              break;
            case '?':
              repeatTimes = random(0, 2);
              break;
          }
        } else if (!m_comma) {
          repeatTimes = parseInt(m_min);
        } else if (m_min && m_comma && !m_max) {
          repeatTimes = random(parseInt(m_min), max);
        } else if (m_min && m_comma && m_max) {
          repeatTimes = random(parseInt(m_min), parseInt(m_max) + 1);
        }

        if (m_slashed_keyword) {
          return (new Array(repeatTimes)).fill(m_slashed_keyword).join('');
        }
        if (m_choice_group) {
          return (new Array(repeatTimes)).fill(m_choice_group).join('');
        }
        if (m_any_word) {
          return (new Array(repeatTimes)).fill(m_any_word).join('');
        }
        if (m_any_char) {
          return (new Array(repeatTimes)).fill(m_any_char).join('');
        }
        return '';
      }
    )
    .replaceAll(/(?<!\\)\[(?<!\\)(\^?)(.+?)(?<!\\)\]/g, (match, m_antonym, m_choices) => {
      let candidates = m_choices.split('');
      let p = 0;
      while (p < candidates.length) {
        if (candidates[p] === '\\') {
          const [nextChar] = candidates.splice(p + 1, 1);
          candidates[p] += nextChar;
        }
        if (candidates[p] === '-') {
          const lastChar = candidates[p - 1];
          const [dash, nextChar] = candidates.splice(p, 2);
          const lastCharCodePoint = lastChar.codePointAt(0);
          const nextCharCodePoint = nextChar.codePointAt(0);
          candidates.splice(
            p,
            0,
            ...(new Array(nextCharCodePoint - lastCharCodePoint))
              .fill(0)
              .map((_, index) => String.fromCodePoint(lastCharCodePoint + index + 1))
          );
          p += nextCharCodePoint - lastCharCodePoint;
          continue;
        }
        if (candidates[p] === '.') {
          candidates.splice(p, 1, '\\.');
        }
        p++;
      }
      if (m_antonym) {
        candidates = range(32, 127)
          .filter(codePoint => !candidates.map(c => c.codePointAt(0)).includes(codePoint))
          .map(codePoint => String.fromCodePoint(codePoint));
      }
      return candidates[random(0, candidates.length)];
    })
    .replaceAll(/(?<!\\)\./g, match => {
      return String.fromCodePoint(random(32, 127));
    })
    .replaceAll(/(?<!\\)\\w/g, match => {
      // [48, 58], [65, 91], [95, 96], [97, 123]
      const codePools = [
        ...range(48, 58),
        ...range(65, 91),
        95,
        ...range(97, 123),
      ];
      return String.fromCodePoint(codePools[random(0, codePools.length)]);
    })
    .replaceAll(/(?<!\\)\\d/g, match => {
      return String.fromCodePoint(random(48, 58));
    })
    .replaceAll(/(?<!\\)\\(.)/g, (match, m_any_char) => {
      // backslash escape character
      return m_any_char;
    })
  ;
};
