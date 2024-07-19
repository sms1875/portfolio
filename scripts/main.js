// 상수 정의
const SECTIONS = {
  ABOUT: "About Me",
  SKILLS: "Skills",
  PROJECTS: "Projects",
  EXPERIENCE: "Experience",
  EDUCATION: "Education",
  CERTIFICATIONS: "Certifications",
};

/**
 * README.md 파일을 가져와 파싱합니다.
 * @async
 * @returns {Promise<string>} 파싱된 HTML 문자열
 * @throws {Error} README.md 파일을 가져오는 데 실패한 경우
 */
async function fetchAndParseReadme() {
  try {
    const response = await fetch("./README.md");
    const text = await response.text();
    return marked.parse(text);
  } catch (error) {
    console.error("README.md 파일을 가져오는 중 오류 발생:", error);
    throw error;
  }
}

/**
 * HTML 콘텐츠를 섹션별로 분리합니다.
 * @param {string} htmlContent - 파싱할 HTML 문자열
 * @returns {Object.<string, string>} 섹션 제목을 키로, 섹션 내용을 값으로 하는 객체
 */
function parseSections(htmlContent) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  const sections = tempDiv.querySelectorAll("h2");
  const parsedSections = {};

  sections.forEach((section) => {
    const sectionTitle = section.innerText;
    let sectionContent = "";
    let nextElement = section.nextElementSibling;
    while (nextElement && nextElement.tagName !== "H2") {
      sectionContent += nextElement.outerHTML;
      nextElement = nextElement.nextElementSibling;
    }
    parsedSections[sectionTitle] = sectionContent;
  });

  return parsedSections;
}

/**
 * 프로젝트 카드 HTML을 생성합니다.
 * @param {HTMLElement} card - 프로젝트 정보를 포함한 HTML 요소
 * @returns {string} 프로젝트 카드 HTML 문자열
 */
function createProjectCard(card) {
  const projectInfo = parseProjectInfo(card);
  return `
    <div class="col-12 mb-4">
      <div class="card project-card">
        <div class="card-body">
          <h3 class="card-title">${card.innerText}</h3>
          <div class="project-images">
            ${projectInfo.images}
          </div>
          <p class="card-text"><strong>설명:</strong> ${
            projectInfo.description
          }</p>
          <p class="card-text"><strong>사용 기술:</strong> ${
            projectInfo.techStack
          }</p>
          ${
            projectInfo.projectLink
              ? `
            <p class="card-text">
              <strong>링크:</strong>
              <a href="${projectInfo.projectLink}" target="_blank" rel="noopener noreferrer">${projectInfo.projectLink}</a>
            </p>
          `
              : ""
          }
        </div>
      </div>
    </div>`;
}

/**
 * 프로젝트 정보를 파싱합니다.
 * @param {HTMLElement} card - 프로젝트 정보를 포함한 HTML 요소
 * @returns {Object} 파싱된 프로젝트 정보 객체
 */
function parseProjectInfo(card) {
  let description = "",
    techStack = "",
    projectLink = "",
    images = "";
  let nextElement = card.nextElementSibling;

  while (nextElement && nextElement.tagName !== "H3") {
    if (nextElement.tagName === "P" || nextElement.tagName === "UL") {
      const imgElements = nextElement.querySelectorAll("img");
      if (imgElements.length > 0) {
        images = Array.from(imgElements)
          .map(
            (img) =>
              `<img src="${img.src}" alt="프로젝트 이미지" class="img-fluid">`
          )
          .join("");
      } else {
        const listItems = nextElement.querySelectorAll("li");
        listItems.forEach((item) => {
          const strongText = item.querySelector("strong")?.innerText || "";
          const itemText = item.innerText.replace(strongText, "").trim();

          if (strongText.includes("Description")) description = itemText;
          else if (strongText.includes("Tech Stack")) techStack = itemText;
          else if (strongText.includes("Link")) {
            projectLink = item.querySelector("a")?.href || itemText;
          }
        });
      }
    }
    nextElement = nextElement.nextElementSibling;
  }

  return { description, techStack, projectLink, images };
}

/**
 * 메인 함수: README 파일을 가져와 파싱하고 DOM에 내용을 삽입합니다.
 * @async
 */
async function main() {
  try {
    const htmlContent = await fetchAndParseReadme();
    const parsedSections = parseSections(htmlContent);

    // 각 섹션의 내용을 해당 요소에 삽입
    Object.entries(SECTIONS).forEach(([key, value]) => {
      const element = document.getElementById(`${key.toLowerCase()}-content`);
      if (element) {
        element.innerHTML = parsedSections[value] || "";
      }
    });

    // 프로젝트 섹션 처리
    const projectList = document.getElementById("project-list");
    if (projectList) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = parsedSections[SECTIONS.PROJECTS] || "";
      const projectCards = tempDiv.querySelectorAll("h3");
      projectList.innerHTML = Array.from(projectCards)
        .map(createProjectCard)
        .join("");
    }

    // ScrollSpy 초기화
    initScrollSpy();
  } catch (error) {
    console.error("메인 함수 실행 중 오류 발생:", error);
  }
}

/**
 * ScrollSpy를 초기화합니다.
 */
function initScrollSpy() {
  const scrollSpy = new bootstrap.ScrollSpy(document.body, {
    target: "#navbarNav",
    offset: 70,
  });
}

// DOMContentLoaded 이벤트 리스너
document.addEventListener("DOMContentLoaded", main);
