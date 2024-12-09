document.addEventListener("DOMContentLoaded", () => {
    const loadSidebar = () => {
        fetch('sidebar.html')
            .then(response => response.text())
            .then(data => {
                const sidebarContainer = document.getElementById('sidebar-container');
                if (!sidebarContainer) {
                    console.error("Sidebar container not found.");
                    return;
                }

                // Inject the sidebar HTML
                sidebarContainer.innerHTML = data;

                // Initialize the sidebar functionality
                const sidebar = document.querySelector(".sidebar");
                const toggleButton = document.querySelector(".menu-toggle");

                if (!sidebar || !toggleButton) {
                    console.error("Sidebar or toggle button not found.");
                    return;
                }

                // Check localStorage for saved state
                const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
                if (isCollapsed) {
                    sidebar.classList.add("collapsed");
                }

                // Toggle sidebar and save state
                toggleButton.addEventListener("click", () => {
                    if (window.innerWidth <= 768) {
                        // For smaller screens, toggle the `show` class
                        sidebar.classList.toggle("show");
                    } else {
                        // For larger screens, toggle the `collapsed` class
                        sidebar.classList.toggle("collapsed");
                        localStorage.setItem(
                            "sidebarCollapsed",
                            sidebar.classList.contains("collapsed")
                        );
                    }
                });

                // Ensure sidebar starts open for larger screens
                const mediaQuery = window.matchMedia("(min-width: 768px)");
                if (mediaQuery.matches && isCollapsed) {
                    sidebar.classList.remove("collapsed");
                    localStorage.setItem("sidebarCollapsed", "false");
                }

                // Listen for screen size changes
                mediaQuery.addEventListener("change", () => {
                    if (mediaQuery.matches) {
                        sidebar.classList.remove("collapsed");
                        localStorage.setItem("sidebarCollapsed", "false");
                    } else {
                        sidebar.classList.remove("show"); // Hide the sidebar for smaller screens
                    }
                });
            })
            .catch(err => console.error("Failed to load sidebar:", err));
    };

    loadSidebar();
});
