document
  .getElementById("adminForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const category = document.getElementById("category").value;
    const itemName = document.getElementById("itemName").value;
    const targetLocation = document.getElementById("targetLocation").value;
    const description = document.getElementById("description").value;

    const formData = {
      category,
      itemName,
      targetLocation,
      description,
    };

    try {
      const response = await fetch(
        "https://eye-traking-demo-proxy-server.glitch.me/saveData",
        {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("데이터가 성공적으로 저장되었습니다.");
        document.getElementById("adminForm").reset();
        fetchData();
      } else if (response.status === 409) {
        alert("중복된 이름의 데이터가 존재합니다.기존 데이터를 수정해주세요");
      } else {
        alert("데이터 저장에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      alert(
        "서버와의 통신에 문제가 발생했습니다.데이터 서버가 일어날때 까지 시간이 걸립니다. 잠시 뒤 시도해주세요.장기적으로 문제가 발생하면 관리자에게 문의해주세요"
      );
    }
  });

async function testConnection() {
  try {
    const response = await fetch(
      "https://eye-traking-demo-proxy-server.glitch.me/testConnection"
    );
    const data = await response.json();
    console.log("Test connection response:", data);
  } catch (error) {
    console.error("Error connecting to the server:", error);
  }
}

testConnection();

const translationMap = {
  etc: "기타안내",
  individual: "국세개인",
  certificate: "증명원",
  corporation: "국세법인",
  "tax-card": "세금,카드",
  "1-floor-service": "1층 민원봉사실",
  "1-floor-eres": "1층 전자신고센터",
  "1-floor-tax-report": "1층 국세신고안내센터",
  "2-floor-back-taxes": "2층 체납징세과",
  "2-floor-vat": "2층 부가가치세과",
  "2-floor-taxpayer-protection": "2층 납세자보호실",
  "3-floor-income-tax": "3층 소득세과",
  "4-floor-property-corporation": "4층 재산법인세과",
  "5-floor-operation-support": "5층 운영지원팀",
  "6-floor-investigation": "6층 조사과",
  "7-floor-conference-room": "7층 대회의실",
};

function groupByCategory(data) {
  const groupedData = {};

  data.forEach((item) => {
    if (!groupedData[item.category]) {
      groupedData[item.category] = [];
    }
    groupedData[item.category].push(item);
  });

  return groupedData;
}

function createCategoryCell(item) {
  const categoryCell = document.createElement("td");
  const categorySelect = document.createElement("select");
  categorySelect.innerHTML = `
    <option value="individual">국세개인</option>
    <option value="certificate">증명원</option>
    <option value="corporation">국세법인</option>
    <option value="tax-card">세금,카드</option>
  `;

  // 영어 코드를 한국어로 변환하기 위한 역 매핑을 만듭니다.
  const reverseTranslationMap = Object.fromEntries(
    Object.entries(translationMap).map(([key, value]) => [value, key])
  );

  // 드롭다운 메뉴의 디폴트 값을 서버에서 받아온 데이터 값으로 설정합니다.
  categorySelect.value = reverseTranslationMap[item.category];
  categoryCell.appendChild(categorySelect);

  return categoryCell;
}

function createTargetLocationCell(item) {
  const targetLocationCell = document.createElement("td");
  const targetLocationSelect = document.createElement("select");
  targetLocationSelect.innerHTML = `
    <optgroup label="1층">
    <option value="1-floor-payment">1층 셀프 결제 코너</option>
      <option value="1-floor-service">1층 민원봉사실</option>
      <option value="1-floor-eres">1층 전자신고센터</option>
      <option value="1-floor-tax-report">1층 국세신고안내센터</option>
    </optgroup>
    <optgroup label="2층">
      <option value="2-floor-back-taxes">2층 체납징세과</option>
      <option value="2-floor-vat">2층 부가가치세과</option>
      <option value="2-floor-taxpayer-protection">2층 납세자보호실</option>
    </optgroup>
    <option value="3-floor-income-tax">3층 소득세과</option>
    <option value="4-floor-property-corporation">4층 재산법인세과</option>
    <option value="5-floor-operation-support">5층 운영지원팀</option>
    <option value="6-floor-investigation">6층 조사과</option>
    <option value="7-floor-conference-room">7층 대회의실</option>
  `;

  // 영어 코드를 한국어로 변환하기 위한 역 매핑을 만듭니다.
  const reverseTranslationMap = Object.fromEntries(
    Object.entries(translationMap).map(([key, value]) => [value, key])
  );

  // 드롭다운 메뉴의 디폴트 값을 서버에서 받아온 데이터 값으로 설정합니다.
  targetLocationSelect.value = reverseTranslationMap[item.targetLocation];
  targetLocationCell.appendChild(targetLocationSelect);

  return targetLocationCell;
}

function createTableRow(item, tableBody) {
  const row = document.createElement("tr");

  const categoryCell = createCategoryCell(item);
  row.appendChild(categoryCell);

  const itemNameCell = document.createElement("td");
  itemNameCell.innerText = item.itemName;
  itemNameCell.setAttribute("contenteditable", "true");
  row.appendChild(itemNameCell);

  const targetLocationCell = createTargetLocationCell(item);
  row.appendChild(targetLocationCell);

  const descriptionCell = document.createElement("td");
  descriptionCell.classList.add("description");
  descriptionCell.innerText = item.description;
  descriptionCell.setAttribute("contenteditable", "true");
  descriptionCell.addEventListener("click", () => {
    descriptionCell.classList.toggle("expand");
  });
  row.appendChild(descriptionCell);

  const actionsCell = document.createElement("td");
  const editButton = document.createElement("button");
  editButton.innerText = "수정";
  editButton.addEventListener("click", async () => {
    const categorySelect = categoryCell.querySelector("select");
    const targetLocationSelect = targetLocationCell.querySelector("select");

    // 변경된 값을 가져옵니다.
    item.category = categorySelect.value;
    item.itemName = itemNameCell.innerText;
    item.targetLocation = targetLocationSelect.value;
    item.description = descriptionCell.innerText;

    // 서버로 수정 요청을 보냅니다.
    const response = await fetch(
      "https://eye-traking-demo-proxy-server.glitch.me/updateData",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      }
    );

    // 응답을 확인하고 에러 처리를 수행합니다.
    if (response.status !== 200) {
      const errorMessage = await response.json();
      alert(errorMessage.message);
    } else {
      const successMessage = await response.json();
      alert(successMessage.message);
    }
  });
  actionsCell.appendChild(editButton);

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "삭제";
  deleteButton.addEventListener("click", async () => {
    // 서버로 삭제 요청을 보냅니다.
    const response = await fetch(
      "https://eye-traking-demo-proxy-server.glitch.me/deleteData",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: item.id }),
      }
    );

    // 응답을 확인하고 에러 처리를 수행합니다.
    if (response.status !== 200) {
      const errorMessage = await response.json();
      alert(errorMessage.message);
    } else {
      const successMessage = await response.json();
      alert(successMessage.message);
      // 삭제 성공시, 테이블에서 해당 행을 제거합니다.
      row.remove();
    }
  });
  actionsCell.appendChild(deleteButton);

  row.appendChild(actionsCell);

  tableBody.appendChild(row);
}

async function fetchData() {
  const response = await fetch(
    "https://eye-traking-demo-proxy-server.glitch.me/getAllData"
  );
  const data = await response.json();

  const tableBody = document.getElementById("tableBody");

  // 기존 테이블의 내용을 삭제합니다.
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }

  const groupedData = groupByCategory(data);
  data.forEach((item) => {
    item.category = translationMap[item.category];
    item.targetLocation = translationMap[item.targetLocation];

    createTableRow(item, tableBody);
  });
}

fetchData();

async function restoreData() {
  const response = await fetch(
    "https://eye-traking-demo-proxy-server.glitch.me/getRecoveryData"
  );
  const recoveryData = await response.json();

  // 기존 테이블의 내용을 삭제합니다.
  const tableBody = document.getElementById("tableBody");
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }

  // 받아온 복구 데이터로 테이블을 업데이트합니다.
  recoveryData.forEach((item) => {
    createTableRow(item, tableBody);
  });
}
document
  .getElementById("restoreDefaultData")
  .addEventListener("click", async () => {
    if (
      confirm(
        "수정되거나 입력된 모든 데이터를 제거하고 초기값으로 바꾸시겠습니까?"
      )
    ) {
      try {
        const response = await fetch(
          "https://eye-traking-demo-proxy-server.glitch.me/getRecoveryData"
        );
        const recoveryData = await response.json();

        // 복원된 데이터로 테이블을 업데이트합니다.
        const tableBody = document.getElementById("tableBody");
        while (tableBody.firstChild) {
          tableBody.removeChild(tableBody.firstChild);
        }

        recoveryData.forEach((item) => {
          item.category = translationMap[item.category];
          item.targetLocation = translationMap[item.targetLocation];

          createTableRow(item, tableBody);
        });

        alert("데이터가 기본값으로 복원되었습니다.");
      } catch (error) {
        alert("데이터 복원 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  });
