export default async function main() {

    const searchInput = document.querySelector('.search-input'); 

    searchInput.addEventListener('focus', () => {
        searchInput.style.borderColor = '#03c75a';
    });

    searchInput.addEventListener('blur', () => {
        searchInput.style.borderColor = '#ddd';
    });
}