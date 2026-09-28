// =====================================================
// CICHLID POSTER MAKER
// =====================================================


// =====================================================
// 1. STORAGE
// =====================================================

const SAVED_CARDS_KEY = "cichlidSavedCards";


// Đang sửa card nào
let editingCardId = null;


// Ảnh hiện tại
let currentImages = {

    main: "",

    male: "",

    female: ""

};


// =====================================================
// 2. LẤY ELEMENT
// =====================================================

const fishName = document.getElementById("fishName");
const scientificName = document.getElementById("scientificName");
const origin = document.getElementById("origin");
const fishSize = document.getElementById("fishSize");
const temperature = document.getElementById("temperature");
const ph = document.getElementById("ph");

const beauty = document.getElementById("beauty");
const care = document.getElementById("care");

const genderType = document.getElementById("genderType");

const genderFields =
    document.getElementById("genderFields");

const breedingDifficulty =
    document.getElementById("breedingDifficulty");

const priceRating =
    document.getElementById("priceRating");

const mainImage =
    document.getElementById("mainImage");

const maleImage =
    document.getElementById("maleImage");

const femaleImage =
    document.getElementById("femaleImage");

const maleDescription =
    document.getElementById("maleDescription");

const femaleDescription =
    document.getElementById("femaleDescription");


// =====================================================
// 3. POSTER ELEMENT
// =====================================================

const posterFishName =
    document.getElementById("posterFishName");

const posterScientificName =
    document.getElementById("posterScientificName");

const posterOrigin =
    document.getElementById("posterOrigin");

const posterSize =
    document.getElementById("posterSize");

const posterTemperature =
    document.getElementById("posterTemperature");

const posterPh =
    document.getElementById("posterPh");

const posterBeauty =
    document.getElementById("posterBeauty");

const posterCare =
    document.getElementById("posterCare");

const posterFishImage =
    document.getElementById("posterFishImage");

const genderPoster =
    document.getElementById("genderPoster");

const posterStars =
    document.getElementById("posterStars");

const posterDifficultyText =
    document.getElementById("posterDifficultyText");

const posterPriceStars =
    document.getElementById("posterPriceStars");

const posterPriceText =
    document.getElementById("posterPriceText");

const posterSizeList =
    document.getElementById("posterSizeList");


// =====================================================
// 4. LẤY STORAGE
// =====================================================

function getLegacySavedCards() {
    try {
        return JSON.parse(
            localStorage.getItem(SAVED_CARDS_KEY) || "[]"
        );
    } catch (error) {
        console.error("Không đọc được dữ liệu cũ:", error);
        return [];
    }
}


async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        },
        ...options
    });

    if (!response.ok) {
        const result = await response.json().catch(function () {
            return {};
        });
        throw new Error(result.error || "Không thể kết nối máy chủ.");
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}


async function saveCardToDatabase(card) {
    return apiRequest(
        "/api/cards/" + encodeURIComponent(card.id),
        {
            method: "PUT",
            body: JSON.stringify(card)
        }
    );
}


async function getSavedCards() {
    let cards = await apiRequest("/api/cards");
    const legacyCards = getLegacySavedCards();

    if (legacyCards.length > 0) {
        const knownIds = new Set(
            cards.map(function (card) {
                return String(card.id);
            })
        );

        for (const card of legacyCards) {
            const id = String(card.id || crypto.randomUUID());
            if (!knownIds.has(id)) {
                await saveCardToDatabase({ ...card, id: id });
                knownIds.add(id);
            }
        }

        cards = await apiRequest("/api/cards");
        localStorage.removeItem(SAVED_CARDS_KEY);
    }

    return cards;
}


// =====================================================
// 6. ĐỌC ẢNH THÀNH BASE64
// =====================================================

function readImage(file) {

    return new Promise(function (resolve) {

        if (!file) {

            resolve("");

            return;

        }


        const reader =
            new FileReader();


        reader.onload = function (event) {

            resolve(event.target.result);

        };


        reader.onerror = function () {

            resolve("");

        };


        reader.readAsDataURL(file);

    });

}


// =====================================================
// 7. TẠO STAR
// =====================================================

function createStars(number) {

    let result = "";


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        if (i <= number) {

            result += "⭐";

        } else {

            result += "☆";

        }

    }


    return result;

}


// =====================================================
// 8. TEXT ĐỘ KHÓ SINH SẢN
// =====================================================

function getBreedingText(number) {

    switch (Number(number)) {

        case 1:
            return "Rất dễ";

        case 2:
            return "Dễ";

        case 3:
            return "Trung bình";

        case 4:
            return "Khó";

        case 5:
            return "Rất khó";

        default:
            return "Chưa xác định";

    }

}


// =====================================================
// 9. TEXT GIÁ
// =====================================================

function getPriceText(number) {

    switch (Number(number)) {

        case 1:
            return "Rất rẻ";

        case 2:
            return "Rẻ";

        case 3:
            return "Trung bình";

        case 4:
            return "Đắt";

        case 5:
            return "Rất đắt";

        default:
            return "Chưa xác định";

    }

}


// =====================================================
// 10. ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    if (value === undefined || value === null) {

        return "";

    }


    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


// =====================================================
// 11. QUẢN LÝ SIZE
// =====================================================


// Lấy tất cả size người dùng nhập
function getAvailableSizes() {

    const inputs =
        document.querySelectorAll(
            ".available-size"
        );


    const sizes = [];


    inputs.forEach(function (input) {

        const value =
            input.value.trim();


        if (value !== "") {

            sizes.push(value);

        }

    });


    return sizes;

}


// -----------------------------------------------------
// Tạo một ô nhập size
// -----------------------------------------------------

function createSizeInput(value = "") {

    const row =
        document.createElement("div");


    row.className =
        "size-input-row";


    row.innerHTML = `

        <input
            type="text"
            class="available-size"
            placeholder="Ví dụ: 5–7 cm"
            value="${escapeHTML(value)}"
        >

        <button
            type="button"
            class="remove-size"
        >
            ×
        </button>

    `;


    return row;

}


// -----------------------------------------------------
// Thêm size
// -----------------------------------------------------

document
    .getElementById("addSize")
    .addEventListener(
        "click",
        function () {

            const container =
                document.getElementById(
                    "availableSizes"
                );


            const row =
                createSizeInput();


            container.appendChild(row);

        }
    );


// -----------------------------------------------------
// Xóa size
// -----------------------------------------------------

document
    .getElementById("availableSizes")
    .addEventListener(
        "click",
        function (event) {

            if (
                event.target.classList
                    .contains("remove-size")
            ) {

                const row =
                    event.target
                        .closest(
                            ".size-input-row"
                        );


                const allRows =
                    document.querySelectorAll(
                        ".size-input-row"
                    );


                // Không cho xóa ô cuối cùng
                if (allRows.length === 1) {

                    row.querySelector(
                        "input"
                    ).value = "";

                    return;

                }


                row.remove();

            }

        }
    );


// =====================================================
// 12. HIỂN THỊ SIZE LÊN POSTER
// =====================================================

function renderAvailableSizes(sizes) {

    posterSizeList.innerHTML = "";


    if (
        !sizes ||
        sizes.length === 0
    ) {

        posterSizeList.innerHTML = `

            <span class="size-badge">
                Chưa nhập size
            </span>

        `;

        return;

    }


    sizes.forEach(function (size) {

        const span =
            document.createElement("span");


        span.className =
            "size-badge";


        span.textContent =
            size;


        posterSizeList.appendChild(span);

    });

}


// =====================================================
// 13. DỊ HÌNH GIỚI TÍNH
// =====================================================

genderType.addEventListener(
    "change",
    function () {

        if (
            genderType.value === "has"
        ) {

            genderFields.classList.remove(
                "hidden"
            );

        } else {

            genderFields.classList.add(
                "hidden"
            );

        }

    }
);


// =====================================================
// 14. RENDER GIỚI TÍNH
// =====================================================

function renderGenderPoster(data) {

    genderPoster.innerHTML = "";


    // ---------------------------------
    // KHÔNG CÓ DỊ HÌNH
    // ---------------------------------

    if (
        data.genderType === "none"
    ) {

        genderPoster.innerHTML = `

            <h2 class="gender-title">
                ♂️♀️ Dị hình giới tính
            </h2>

            <div class="no-gender">

                Loài này không có
                dị hình giới tính rõ rệt.
                Việc phân biệt đực và cái
                có thể khó khăn nếu chỉ dựa
                vào ngoại hình.

            </div>

        `;

        return;

    }


    // ---------------------------------
    // CÓ DỊ HÌNH
    // ---------------------------------

    genderPoster.innerHTML = `

        <h2 class="gender-title">
            ♂️♀️ Dị hình giới tính
        </h2>

        <div class="gender-grid">


            <div class="gender-card">

                ${
                    data.maleImage
                    ?
                    `<img
                        src="${data.maleImage}"
                        alt="Cá đực"
                    >`
                    :
                    ""
                }


                <h4>
                    ♂️ Cá đực
                </h4>


                <p>
                    ${
                        escapeHTML(
                            data.maleDescription ||
                            "Chưa nhập mô tả."
                        )
                    }
                </p>

            </div>



            <div class="gender-card">

                ${
                    data.femaleImage
                    ?
                    `<img
                        src="${data.femaleImage}"
                        alt="Cá cái"
                    >`
                    :
                    ""
                }


                <h4>
                    ♀️ Cá cái
                </h4>


                <p>
                    ${
                        escapeHTML(
                            data.femaleDescription ||
                            "Chưa nhập mô tả."
                        )
                    }
                </p>

            </div>


        </div>

    `;

}


// =====================================================
// 15. TẠO DATA TỪ FORM
// =====================================================

async function getFormData() {

    // Đọc ảnh mới
    const mainFile =
        mainImage.files[0];

    const maleFile =
        maleImage.files[0];

    const femaleFile =
        femaleImage.files[0];


    if (mainFile) {

        currentImages.main =
            await readImage(mainFile);

    }


    if (maleFile) {

        currentImages.male =
            await readImage(maleFile);

    }


    if (femaleFile) {

        currentImages.female =
            await readImage(femaleFile);

    }


    return {

        id:
            editingCardId ||
            crypto.randomUUID(),


        name:
            fishName.value.trim(),


        scientificName:
            scientificName.value.trim(),


        origin:
            origin.value.trim(),


        size:
            fishSize.value.trim(),


        temperature:
            temperature.value.trim(),


        ph:
            ph.value.trim(),


        beauty:
            beauty.value.trim(),


        care:
            care.value.trim(),


        genderType:
            genderType.value,


        maleDescription:
            maleDescription.value.trim(),


        femaleDescription:
            femaleDescription.value.trim(),


        breedingDifficulty:
            Number(
                breedingDifficulty.value
            ),


        priceRating:
            Number(
                priceRating.value
            ),


        mainImage:
            currentImages.main,


        maleImage:
            currentImages.male,


        femaleImage:
            currentImages.female,


        // QUAN TRỌNG
        // Lưu danh sách size
        availableSizes:
            getAvailableSizes()

    };

}


// =====================================================
// 16. RENDER POSTER
// =====================================================

function renderPoster(data) {

    posterFishName.textContent =
        data.name ||
        "Tên cá";


    posterScientificName.textContent =
        data.scientificName ||
        "Tên khoa học";


    posterOrigin.textContent =
        data.origin ||
        "-";


    posterSize.textContent =
        data.size ||
        "-";


    posterTemperature.textContent =
        data.temperature ||
        "-";


    posterPh.textContent =
        data.ph ||
        "-";


    posterBeauty.textContent =
        data.beauty ||
        "-";


    posterCare.textContent =
        data.care ||
        "-";


    // ---------------------------------
    // ẢNH
    // ---------------------------------

    if (data.mainImage) {

        posterFishImage.src =
            data.mainImage;

    } else {

        posterFishImage.removeAttribute(
            "src"
        );

        posterFishImage.alt =
            "Chưa có ảnh";

    }


    // ---------------------------------
    // GIỚI TÍNH
    // ---------------------------------

    renderGenderPoster(data);


    // ---------------------------------
    // SINH SẢN
    // ---------------------------------

    posterStars.textContent =
        createStars(
            data.breedingDifficulty
        );


    posterDifficultyText.textContent =
        getBreedingText(
            data.breedingDifficulty
        );


    // ---------------------------------
    // GIÁ
    // ---------------------------------

    posterPriceStars.textContent =
        createStars(
            data.priceRating
        );


    posterPriceText.textContent =
        getPriceText(
            data.priceRating
        );


    // ---------------------------------
    // SIZE CỬA HÀNG
    // ---------------------------------

    renderAvailableSizes(
        data.availableSizes
    );

}


// =====================================================
// 17. NÚT TẠO POSTER
// =====================================================

document
    .getElementById("createPoster")
    .addEventListener(
        "click",
        async function () {

            const data =
                await getFormData();


            renderPoster(data);


            // Cuộn xuống poster
            document
                .getElementById("poster")
                .scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

        }
    );


// =====================================================
// 18. LƯU CARD
// =====================================================

document
    .getElementById("saveCard")
    .addEventListener(
        "click",
        async function () {

            try {
                const data = await getFormData();
                const savedCard = await saveCardToDatabase(data);
                editingCardId = null;
                renderPoster(savedCard);
                await renderSavedCards();
                alert("✅ Đã lưu poster vào MongoDB!");
            } catch (error) {
                console.error(error);
                alert("Không lưu được poster: " + error.message);
            }

        }
    );


// =====================================================
// 19. RENDER DANH SÁCH CARD
// =====================================================

async function renderSavedCards(
    keyword = ""
) {

    const container =
        document.getElementById(
            "savedCards"
        );


    container.innerHTML = "";


    let cards;

    try {
        cards = await getSavedCards();
    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <div class="empty-message">
                Không kết nối được MongoDB. Hãy chạy máy chủ và kiểm tra cấu hình kết nối.
            </div>
        `;
        return;
    }


    const filteredCards =
        cards.filter(
            function (card) {

                return card.name
                    .toLowerCase()
                    .includes(
                        keyword
                            .toLowerCase()
                    );

            }
        );


    if (
        filteredCards.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-message">

                Chưa có poster nào.

            </div>

        `;

        return;

    }


    filteredCards
        .slice()
        .reverse()
        .forEach(
            function (card) {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "saved-card";


                div.innerHTML = `

                    ${
                        card.mainImage
                        ?
                        `<img
                            src="${card.mainImage}"
                            alt="${escapeHTML(card.name)}"
                        >`
                        :
                        ""
                    }


                    <div class="saved-card-content">

                        <h3>
                            ${escapeHTML(
                                card.name
                            )}
                        </h3>


                        <p>
                            ${escapeHTML(
                                card.scientificName
                            )}
                        </p>


                        <p>
                            🏪 ${
                                card.availableSizes
                                ?
                                card.availableSizes.length
                                :
                                0
                            } size đang có
                        </p>


                        <div class="saved-card-buttons">

                            <button
                                class="view-card"
                                data-id="${card.id}"
                            >
                                👀 Xem
                            </button>


                            <button
                                class="edit-card"
                                data-id="${card.id}"
                            >
                                ✏️ Sửa
                            </button>


                            <button
                                class="delete-card"
                                data-id="${card.id}"
                            >
                                🗑️ Xóa
                            </button>

                        </div>

                    </div>

                `;


                container.appendChild(div);

            }
        );

}


// =====================================================
// 20. XỬ LÝ CARD
// =====================================================

document
    .getElementById("savedCards")
    .addEventListener(
        "click",
        async function (event) {

            const button =
                event.target.closest(
                    "button"
                );


            if (!button) return;


            const id = button.dataset.id;
            let cards;

            try {
                cards = await getSavedCards();
            } catch (error) {
                alert("Không tải được poster: " + error.message);
                return;
            }

            const card = cards.find(function (item) {
                return String(item.id) === id;
            });


            if (!card) return;


            // =================================
            // XEM
            // =================================

            if (
                button.classList
                    .contains("view-card")
            ) {

                renderPoster(card);


                document
                    .getElementById("poster")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }


            // =================================
            // SỬA
            // =================================

            if (
                button.classList
                    .contains("edit-card")
            ) {

                loadCardToForm(card);


                document
                    .querySelector(".form-section")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }


            // =================================
            // XÓA
            // =================================

            if (
                button.classList
                    .contains("delete-card")
            ) {

                const confirmDelete =
                    confirm(
                        "Bạn có chắc muốn xóa poster này?"
                    );


                if (!confirmDelete) {

                    return;

                }


                try {
                    await apiRequest(
                        "/api/cards/" + encodeURIComponent(id),
                        { method: "DELETE" }
                    );
                    await renderSavedCards();
                } catch (error) {
                    alert("Không xóa được poster: " + error.message);
                }

            }

        }
    );


// =====================================================
// 21. LOAD CARD VÀO FORM
// =====================================================

function loadCardToForm(card) {

    editingCardId =
        card.id;


    fishName.value =
        card.name || "";


    scientificName.value =
        card.scientificName || "";


    origin.value =
        card.origin || "";


    fishSize.value =
        card.size || "";


    temperature.value =
        card.temperature || "";


    ph.value =
        card.ph || "";


    beauty.value =
        card.beauty || "";


    care.value =
        card.care || "";


    genderType.value =
        card.genderType || "none";


    maleDescription.value =
        card.maleDescription || "";


    femaleDescription.value =
        card.femaleDescription || "";


    breedingDifficulty.value =
        card.breedingDifficulty || 1;


    priceRating.value =
        card.priceRating || 1;


    // ---------------------------------
    // ẢNH
    // ---------------------------------

    currentImages.main =
        card.mainImage || "";


    currentImages.male =
        card.maleImage || "";


    currentImages.female =
        card.femaleImage || "";


    // ---------------------------------
    // DỊ HÌNH
    // ---------------------------------

    if (
        card.genderType === "has"
    ) {

        genderFields.classList.remove(
            "hidden"
        );

    } else {

        genderFields.classList.add(
            "hidden"
        );

    }


    // ---------------------------------
    // SIZE
    // ---------------------------------

    const container =
        document.getElementById(
            "availableSizes"
        );


    container.innerHTML = "";


    const sizes =
        card.availableSizes || [];


    if (sizes.length === 0) {

        container.appendChild(
            createSizeInput()
        );

    } else {

        sizes.forEach(
            function (size) {

                container.appendChild(
                    createSizeInput(size)
                );

            }
        );

    }


    renderPoster(card);

}


// =====================================================
// 22. TẠO CARD MỚI
// =====================================================

document
    .getElementById("newCard")
    .addEventListener(
        "click",
        function () {

            resetForm();

        }
    );


// =====================================================
// 23. RESET FORM
// =====================================================

function resetForm() {

    editingCardId = null;


    currentImages = {

        main: "",

        male: "",

        female: ""

    };


    fishName.value = "";

    scientificName.value = "";

    origin.value = "";

    fishSize.value = "";

    temperature.value = "";

    ph.value = "";

    beauty.value = "";

    care.value = "";


    genderType.value =
        "none";


    genderFields.classList.add(
        "hidden"
    );


    maleDescription.value = "";

    femaleDescription.value = "";


    breedingDifficulty.value =
        "1";


    priceRating.value =
        "1";


    mainImage.value = "";

    maleImage.value = "";

    femaleImage.value = "";


    // Reset size
    const container =
        document.getElementById(
            "availableSizes"
        );


    container.innerHTML = "";


    container.appendChild(
        createSizeInput()
    );


    renderPoster({

        name: "",

        scientificName: "",

        origin: "",

        size: "",

        temperature: "",

        ph: "",

        beauty: "",

        care: "",

        genderType: "none",

        breedingDifficulty: 1,

        priceRating: 1,

        mainImage: "",

        maleImage: "",

        femaleImage: "",

        maleDescription: "",

        femaleDescription: "",

        availableSizes: []

    });

}


// =====================================================
// 24. SEARCH
// =====================================================

document
    .getElementById("searchSavedCards")
    .addEventListener(
        "input",
        function () {

            renderSavedCards(
                this.value
            );

        }
    );


// =====================================================
// 25. CHỜ ẢNH LOAD
// =====================================================

function waitForImages(container) {

    const images =
        container.querySelectorAll(
            "img"
        );


    return Promise.all(

        Array.from(images)
            .map(
                function (img) {

                    if (
                        img.complete
                    ) {

                        return Promise.resolve();

                    }


                    return new Promise(
                        function (resolve) {

                            img.onload =
                                resolve;

                            img.onerror =
                                resolve;

                        }
                    );

                }
            )

    );

}


// =====================================================
// 26. DOWNLOAD PNG
// =====================================================

document
    .getElementById("downloadPoster")
    .addEventListener(
        "click",
        async function () {

            const poster =
                document.getElementById(
                    "poster"
                );


            if (
                typeof html2canvas ===
                "undefined"
            ) {

                alert(
                    "Không tải được thư viện html2canvas."
                );

                return;

            }


            await waitForImages(
                poster
            );


            try {

                const canvas =
                    await html2canvas(
                        poster,
                        {

                            scale: 2,

                            backgroundColor:
                                "#071b22",

                            useCORS:
                                true,

                            logging:
                                false,

                            imageTimeout:
                                15000

                        }
                    );


                const link =
                    document.createElement(
                        "a"
                    );


                let filename =
                    fishName.value.trim();


                if (!filename) {

                    filename =
                        "cichlid-poster";

                }


                filename =
                    filename.replace(
                        /[\\/:*?"<>|]/g,
                        ""
                    );


                link.download =
                    filename +
                    ".png";


                link.href =
                    canvas.toDataURL(
                        "image/png"
                    );


                link.click();

            } catch (error) {

                console.error(error);


                alert(
                    "Không thể tạo ảnh PNG."
                );

            }

        }
    );


// =====================================================
// 27. KHỞI TẠO
// =====================================================

renderSavedCards();


// =====================================================
// 28. PWA SERVICE WORKER
// =====================================================

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        function () {

            navigator.serviceWorker
                .register("./sw.js")
                .then(
                    function () {

                        console.log(
                            "✅ PWA đã được kích hoạt"
                        );

                    }
                )
                .catch(
                    function (error) {

                        console.log(
                            "❌ PWA lỗi:",
                            error
                        );

                    }
                );

        }
    );

}