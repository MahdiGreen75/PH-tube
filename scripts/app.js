const getArrayDataFromAPI = async (key) => {
    const res = await fetch(key);
    const data = await res.json();
    const arr = data.data;
    return arr;
}

//on page load catagory functionality will happen.
const catagoryButtons = () => {
    const catagorySection = document.getElementById("catagory-section");
    const catagories = getArrayDataFromAPI("https://openapi.programming-hero.com/api/videos/categories");
    catagories.then(res => {
        res.forEach(item => {

            let { category_id: id, category } = item;
            const button = document.createElement("button");
            button.classList = "px-3 py-1 rounded bg-gray-300 border-transparent hover:bg-red-500 hover:text-white";
            button.setAttribute("onclick", `showCards('${id}')`);
            button.setAttribute("id", `${id}`);
            if (id === "1000") {
                button.classList.add("catagory-btn");
            } else {
                button.setAttribute("executeWhenLoads", "false")
            }

            button.innerText = `${category}`;
            catagorySection.appendChild(button);
        })
    })
}
catagoryButtons();

// showing cards on clicking upon catagory buttons

// the object below is synchronous , asynchronous code will assign async data into it.
let cachedDataFromAPI;


const asyncArrayToUI = (res, whereToShow) => {
    whereToShow.innerHTML = "";
    res.forEach(item => {

        let { category_id,
            thumbnail,
            title,
            authors: [{ profile_picture,
                profile_name,
                verified }],
            others: { views,
                posted_date }
        } = item;

        const postedDateToHours = (posted_date) => {
            const hours = Math.trunc(posted_date / 3600);
            const restFraction = (posted_date / 3600) - hours;
            const min = Math.trunc(restFraction * 60);
            return `${hours} hours ${min} min ago`;
        }

        let videoPostedTime = `<span class="absolute right-1 bottom-1 text-xs bg-black text-white rounded-md p-1 opacity-60">
            ${postedDateToHours(posted_date)}
        </span>`;

        const div = document.createElement("div");
        div.classList = "w-60 mx-auto sm:w-auto sm:mx-auto";
        div.innerHTML = `
        <div class="h-40 bg-blue-300 rounded-xl border border-transparent mb-2 relative">
        <img src="${thumbnail}" alt="" class="w-full object-cover h-full rounded-xl">
        ${Boolean(+posted_date)? videoPostedTime : ""}
        </div>
        <div class="flex flex-row items-start justify-center gap-2 h-24">
        <div class="flex flex-col justify-start items-center h-full w-[20%]">
            <div class="w-10 h-10 flex justify-center items-center overflow-hidden rounded-full">
                <img src="${profile_picture}" alt="" class="rounded-full object-cover w-full h-full ">
            </div>
        </div>
        <div class="flex flex-col justify-center items-start gap-1 w-[80%]">
            <h1 class="font-semibold text-base leading-normal">${title}</h1>
            <div class="flex flex-row items-center">
                <span class="text-xs font-normal text-gray-500 mr-1">${profile_name}</span>
                <span>
                    <img class="w-4" src="${verified ? "./images/orange.svg" : "./images/white.png"}" alt="">
                </span>
            </div>
            <div class="text-xs font-normal text-gray-500">
                <span class="mr-1">${views}</span>views
            </div>
        </div>
        </div>  
        `;
        whereToShow.appendChild(div);
    })
    const noContentMsg = document.getElementById("no-content-msg");
    if (!res.length) {
        noContentMsg.style.display = "block";
    } else {
        noContentMsg.style.display = "none";
    }
}

const showAPIDataToUI = (resolvedData, whereToShow) => {

    resolvedData.then((res) => {
        asyncArrayToUI(res, whereToShow);
    })
}

const showCards = (id) => {
    if (!(id === 1000)) {
        const firstCategoryBtn = document.getElementById("1000");
        firstCategoryBtn.classList.remove("catagory-btn");


    }
    const key = `https://openapi.programming-hero.com/api/videos/category/${id}`;
    const cardsArray = getArrayDataFromAPI(key);
    const cardsParent = document.getElementById("cards-parent");
    // assingning async data to outer enviroement for sort by view functionallity.
    cachedDataFromAPI = cardsArray;
    showAPIDataToUI(cardsArray, cardsParent);

}

// sort by view functionallity
const objToViewCount = (obj) => {
    const viewsWithUnit = obj.others.views;
    const viewsInNum = +parseFloat(viewsWithUnit) * 1000;
    return viewsInNum;
}

const sortByView = () => {
    const cardsParent = document.getElementById("cards-parent");

    cachedDataFromAPI.then(res => {
        res.sort((a, b) => objToViewCount(b) - objToViewCount(a));
        asyncArrayToUI(res, cardsParent);
    })


}



//Adding auto selection of first catagory button after DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    showCards(1000);
});






