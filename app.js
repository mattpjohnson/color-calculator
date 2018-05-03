const originalInput = document.getElementById('original');
const updatedInput = document.getElementById('updated');

function updateResults() {
  console.log('updating colors');
  const originalColor = one.color(originalInput.value);
  const updatedColor = one.color(updatedInput.value);

  const original = { h: originalColor.hue() * 360, s: originalColor.saturation(), l: originalColor.lightness(), a: originalColor.alpha() };
  const updated = { h: updatedColor.hue() * 360, s: updatedColor.saturation(), l: updatedColor.lightness(), a: updatedColor.alpha() };

  function getHslaDifference(hsla1, hsla2) {
    return {
      h: hsla1.h - hsla2.h,
      s: hsla1.s - hsla2.s,
      l: hsla1.l - hsla2.l,
      a: hsla1.a - hsla2.a,
    };
  }

  function createBoxForHsla({ h, s, l, a }) {
    const hslaString = `hsla(${h}, ${s * 100}%, ${l * 100}%, ${a})`;
    const box = document.createElement('div');
    box.classList.add('box');
    box.style = `background-color: ${hslaString}`;
    return box;
  }

  function getScssLightenForDifference(color, l) {
    l = l.toFixed(2);

    if (l == 0) {
      return color;
    }

    if (l < 0) {
      return `lighten(${color}, ${Math.abs(l)})`;
    }

    return `darken(${color}, ${l})`;
  }

  function getScssSaturateForDifference(color, s) {
    s = s.toFixed(2);

    if (s == 0) {
      return color;
    }

    if (s < 0) {
      return `desaturate(${color}, ${Math.abs(s)})`;
    }

    return `saturate(${color}, ${s})`;
  }

  function getScssAdjustHueForDifference(color, h) {
    h = h.toFixed(2);

    if (h == 0) {
      return color;
    }

    return `adjust-hue(${color}, ${(h + 360) % 360 * 0.28})`;
  }


  function getScssFormulaForDifference({ h, s, l, a }) {
    return getScssAdjustHueForDifference(getScssSaturateForDifference(getScssLightenForDifference('$color', l), s), h);
  }

  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';
  const difference = getHslaDifference(original, updated);

  for (const hDiff of [0, 90, 180, 270]) {

    const hsla1 = { ...original };

    const row = document.createElement('div');
    row.classList.add('row');

    for (const sm of [-1.75, -1.5, -1, -0.5, -0.25, 0, 0.25, 0.5, 1, 1.5, 1.75]) {
      const adjustedDifference = {
        h: difference.h * sm - hDiff,
        s: difference.s * sm,
        l: difference.l * sm,
        a: difference.a * sm
      };

      const box = createBoxForHsla({
        h: hsla1.h - adjustedDifference.h,
        s: hsla1.s - adjustedDifference.s,
        l: hsla1.l - adjustedDifference.l,
        a: hsla1.a - adjustedDifference.a
      });
      if (sm === 0) {
        box.classList.add('box--original');
      }
      box.title = getScssFormulaForDifference(adjustedDifference);
      row.appendChild(box);
    }

    resultsDiv.appendChild(row);
  }
};

originalInput.onchange = updateResults;
updatedInput.onchange = updateResults;

updateResults();