document.addEventListener("DOMContentLoaded", () => {
  fetch("README.md")
    .then((response) => response.text())
    .then((text) => {
      const htmlContent = marked.parse(text);
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;

      const sections = tempDiv.querySelectorAll("h2");
      sections.forEach((section) => {
        const sectionTitle = section.innerText;
        let sectionContent = "";
        let nextElement = section.nextElementSibling;
        while (nextElement && nextElement.tagName !== "H2") {
          sectionContent += nextElement.outerHTML;
          nextElement = nextElement.nextElementSibling;
        }

        if (sectionTitle === "About Me") {
          document.getElementById("about-content").innerHTML = sectionContent;
        } else if (sectionTitle === "Skills") {
          document.getElementById("skills-content").innerHTML = sectionContent;
        } else if (sectionTitle === "Projects") {
          const projectList = document.getElementById("project-list");
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = sectionContent;

          const projectCards = tempDiv.querySelectorAll("h3");
          projectCards.forEach((card) => {
            let description = "";
            let techStack = "";
            let projectLink = "";

            let nextElement = card.nextElementSibling;

            while (nextElement && nextElement.tagName !== "H3") {
              if (nextElement.tagName === "P" || nextElement.tagName === "UL") {
                // 이미지가 있는 경우
                if (nextElement.querySelectorAll("img").length > 0) {
                  // Description 요소로 가정
                  description = nextElement.innerHTML;
                } else {
                  // 목록 항목으로 가정
                  const listItems = nextElement.querySelectorAll("li");
                  listItems.forEach((item) => {
                    const strongText = item.querySelector("strong").innerText;
                    const itemText = item.innerText
                      .replace(strongText, "")
                      .trim();

                    if (strongText.includes("Description")) {
                      description = itemText;
                    } else if (strongText.includes("Tech Stack")) {
                      techStack = itemText;
                    } else if (strongText.includes("Link")) {
                      projectLink = item.querySelector("a")
                        ? item.querySelector("a").href
                        : itemText;
                    }
                  });
                }
              }
              nextElement = nextElement.nextElementSibling;
            }

            projectList.innerHTML += `
              <div class="col-12"> <!-- 1칸 넓이 설정 -->
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title">${card.innerText}</h5>
                    <div class="card-images">
                      ${Array.from(
                        card.nextElementSibling.querySelectorAll("img")
                      )
                        .map(
                          (img) =>
                            `<img src="${img.src}" alt="프로젝트 이미지">`
                        )
                        .join("")}
                    </div>
                    <p class="card-text"><strong>설명:</strong> ${description}</p>
                    <p class="card-text"><strong>기술 스택:</strong> ${techStack}</p>
                    ${
                      projectLink
                        ? `<p class="card-text"><strong>Link:</strong> <a href="${projectLink}" target="_blank">${projectLink}</a></p>`
                        : ""
                    }
                  </div>
                </div>
              </div>`;
          });
        } else if (sectionTitle === "Experience") {
          document.getElementById("experience-content").innerHTML =
            sectionContent;
        } else if (sectionTitle === "Education") {
          document.getElementById("education-content").innerHTML =
            sectionContent;
        } else if (sectionTitle === "Certifications") {
          document.getElementById("certifications-content").innerHTML =
            sectionContent;
        }
      });
    })
    .catch((error) => console.error("Error fetching README.md:", error));
});
