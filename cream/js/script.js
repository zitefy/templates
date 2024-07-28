function calculateAge(dateString) {
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

const elementUpdates = [
    { id: 'name', transform: content => `Hi, I'm ${content}` },
    { id: 'username', transform: content => `@${content} on zitefy` },
    { id: 'pronouns', transform: content => `[${content}]` },
    { id: 'dob', transform: content => {
        const age = calculateAge(content);
        const ageElement = document.getElementById('age');
        if (ageElement) {
            ageElement.innerHTML = `[${age} y/o]`;
        }
        return content;
    }},
    { id: 'email', transform: content => `ping me at ${content}` }
];

function updateElements() {
    elementUpdates.forEach(({ id, transform }) => {
        const element = document.getElementById(id);
        if (element) {
            const content = element.innerHTML.trim();
            if (content !== '') {
                element.innerHTML = transform(content);
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', updateElements);