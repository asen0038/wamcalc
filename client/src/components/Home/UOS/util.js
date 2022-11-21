export function progressBarColor(assessmentList, goal) {
  return currentMark(assessmentList) === 0
    ? "green"
    : currentMark(assessmentList) >= goal
    ? "green"
    : "red";
}

export function finalMarkRequired(assessmentList, goal) {
  if (goal === 0) {
    return 0;
  }

  if (assessmentList.length === 0) {
    return 0;
  }

  let allMarksHere = true;
  let finalNotHere = true;

  assessmentList.forEach((assessment) => {
    if (!assessment.isFinal) {
      if (assessment.mark === -1) {
        // Marks of all assessments should be present to give req mark
        allMarksHere = false;
      }
    } else {
      // assessment is final exam
      if (assessment.mark !== -1) {
        // Final Exam's marks shouldn't have been entered by the user to give req mark
        finalNotHere = false;
      }
    }
  });

  if (allMarksHere && finalNotHere) {
    let finalWeight = 0;

    assessmentList.forEach((assessment) => {
      if (assessment.isFinal) {
        finalWeight = assessment.weight;
      }
    });

    let marksInAssessments = 0;

    assessmentList.forEach((assessment) => {
      if (!assessment.isFinal) {
        marksInAssessments += (assessment.mark / 100) * assessment.weight;
      }
    });

    return (((goal - marksInAssessments) / finalWeight) * 100).toFixed(1);
  } else {
    return 0;
  }
}

export function weightSum(assessmentList) {
  let weightSum = 0;
  assessmentList.forEach((assessment) => {
    if (assessment.weight) {
      weightSum += assessment.weight;
    }
  });
  return weightSum;
}

export function currentMark(assessmentList) {
  if (assessmentList.length === 0) {
    return 0;
  }

  let totalWeight = 0;

  assessmentList.forEach((assessment) => {
    if (assessment.mark !== -1) {
      totalWeight += assessment.weight;
    }
  });

  if (totalWeight === 0) {
    return 0;
  }

  let totalMarksAchieved = 0;

  assessmentList.forEach((assessment) => {
    if (assessment.mark !== -1) {
      totalMarksAchieved += (assessment.mark / 100) * assessment.weight;
    }
  });

  let markPercentage = (totalMarksAchieved / totalWeight) * 100;

  return markPercentage.toFixed(1);
}

export function haveFinal(assessmentList) {
  let haveFinal = false;

  assessmentList.forEach((assessment) => {
    if (assessment.isFinal) {
      haveFinal = true;
    }
  });

  return haveFinal;
}
