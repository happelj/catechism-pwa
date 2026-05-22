const qwertyRows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

function qwertyPosition(character: string) {
  for (const [rowIndex, row] of qwertyRows.entries()) {
    const characterIndex = row.indexOf(character);

    if (characterIndex >= 0) {
      return {
        row: rowIndex,
        x: rowIndex + characterIndex * 2,
      };
    }
  }

  return null;
}

export function acceptedTypedChar(expected: string, typed: string) {
  const expectedLower = expected.toLowerCase();
  const typedLower = typed.toLowerCase();

  if (expectedLower === typedLower) {
    return true;
  }

  if (!/^[a-z]$/.test(expectedLower) || !/^[a-z]$/.test(typedLower)) {
    return false;
  }

  const expectedPosition = qwertyPosition(expectedLower);
  const typedPosition = qwertyPosition(typedLower);

  if (!expectedPosition || !typedPosition) {
    return false;
  }

  const rowDifference = Math.abs(expectedPosition.row - typedPosition.row);
  const xDifference = Math.abs(expectedPosition.x - typedPosition.x);

  if (rowDifference === 0) {
    return xDifference === 2;
  }

  return rowDifference === 1 && xDifference <= 1;
}
