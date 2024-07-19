document.addEventListener('DOMContentLoaded', () => {
    fetch('README.md')
        .then(response => response.text())
        .then(text => {
            const htmlContent = marked.parse(text);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;

            const sections = tempDiv.querySelectorAll('h2');
            sections.forEach(section => {
                const sectionTitle = section.innerText;
                let sectionContent = '';
                let nextElement = section.nextElementSibling;
                while (nextElement && nextElement.tagName !== 'H2') {
                    sectionContent += nextElement.outerHTML;
                    nextElement = nextElement.nextElementSibling;
                }

                if (sectionTitle === '소개') {
                    document.getElementById('about-content').innerHTML = sectionContent;
                } else if (sectionTitle === '기술 스택') {
                    document.getElementById('skills-content').innerHTML = sectionContent;
                } else if (sectionTitle === '프로젝트') {
                    const projectList = document.getElementById('project-list');
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = sectionContent;
                    const projectTitles = tempDiv.querySelectorAll('h3');
                    projectTitles.forEach(title => {
                        const description = title.nextElementSibling ? title.nextElementSibling.innerText : '';
                        projectList.innerHTML += `
                            <div class="col-md-4">
                                <div class="card mb-4">
                                    <div class="card-body">
                                        <h5 class="card-title">${title.innerText}</h5>
                                        <p class="card-text">${description}</p>
                                    </div>
                                </div>
                            </div>`;
                    });
                } else if (sectionTitle === '경력') {
                    document.getElementById('experience-content').innerHTML = sectionContent;
                } else if (sectionTitle === '교육') {
                    document.getElementById('education-content').innerHTML = sectionContent;
                } else if (sectionTitle === '수상 내역') {
                    document.getElementById('awards-content').innerHTML = sectionContent;
                } else if (sectionTitle === '자격증') {
                    document.getElementById('certifications-content').innerHTML = sectionContent;
                } else if (sectionTitle === '연락처') {
                    document.getElementById('contact-content').innerHTML = sectionContent;
                }
            });
        })
        .catch(error => console.error('Error fetching README.md:', error));
});
