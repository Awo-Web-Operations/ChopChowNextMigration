import Header from "../../src/components/Header/Header";
import SideNav from "../../src/components/Header/sidenav";
import {
  container,
  col2,
  left,
  empty,
  center,
  status,
  approve,
  pending,
  rejected,
  actionIcon,
} from "../../src/components/dashboard/dashboard.module.css";
import styles from "../../src/components/dashboard/suggestedmeals.module.css";
import { CloseFillIcon, FillterIcon } from "../../src/components/icons";
import Link from "next/link";
import Sidenav2 from "../../src/components/Header/sidenav2";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { connect, useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "../../src/util/Api";
import Meal from "../../src/components/individualPage/Meal";
import WestIcon from "@mui/icons-material/West";
import TransferToInventory from "../../src/components/dashboard/transferToInventory";
import SuggestedMealRow from "../../src/components/dashboard/suggestedmealRow";
import Sent from "../../src/components/dashboard/sent";
import Popup2 from "../../src/components/popups/popup2";
import Popup1 from "../../src/components/popups/popup1";
import Product from "../../src/components/individualPage/Product";
import AddIcon from "@mui/icons-material/Add";
import moment from "moment";
import { useParams } from "next/navigation";

import {
  suggestion_form_image,
  suggestion_form_image_col_1,
  suggestion_form_image_icon,
  suggestion_form_image_icon_con,
} from "../../src/components/suggestionPages/suggestion.module.css";
import Image from "next/image";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import SuggestedProductRow from "../../src/components/dashboard/suggestedproductRow";
import { toast } from "react-toastify";
import { SuggestedDescription } from "../../src/components/dashboard/suggesteddescriptionRow";
import { SuggestedMeasurement } from "../../src/components/dashboard/suggestedmeasurementRow";
import { SuggestedCategories } from "../../src/components/dashboard/suggestedCategories";
import SuggestedStores from "../../src/components/dashboard/suggestedStores";
import Store from "../../src/components/individualPage/Store";
import { RejectionModal } from "../../src/components/modal/rejection-modal";
import { debounce } from "lodash";

const SuggestedMeals = (props) => {
  const router = useRouter();
  const [addPublicMeal, setAddPublicMeal] = useState();
  const [searchType, setSearchType] = useState("Meal");
  const [searchOption, setSearchOption] = useState();
  const [search, setSearchState] = useState(false);
  const [showReason, setShowReasonState] = useState(false);
  const [suggestions, setSuggestionsState] = useState([]);
  const [publicSuggestions, setPublicSuggestionsState] = useState([]);
  const [suggestion, setSuggestionState] = useState({});
  const [filteredSuggestions, setFilteredSuggestionsState] = useState([]);
  const [searchSuggestedSuggestion, setSearchSuggestedSuggestionState] =
    useState("");
  const [openSuggestion, setOpenSuggestionState] = useState(false);
  const [openStoreSuggestion, setOpenStoreSuggestion] = useState(false);
  const [changeStatus, setChangeStatusState] = useState(false);
  const [changeStoreStatus, setChangeStoreStatus] = useState(false);
  const [transferToInventory, setTransferToInventoryState] = useState(false);
  const [sent, setSentState] = useState(false);
  const [openModal, setOpenModalState] = useState(false);
  const [openModal2, setOpenModal2State] = useState(false);
  const [statusType, setStatusTypeState] = useState("");
  const [storeStatus, setStoreStatus] = useState("");
  const [page, setPageState] = useState(1);
  const [pages, setPagesState] = useState(1);
  const [ingredientsStringSyntax, setIngredientsString] = useState([]);
  const [suggestionCount, setSuggestedCountState] = useState(0);
  const [status2, setStatus2State] = useState("");
  const [message, setMessageState] = useState("");
  const [relateds, setRelatedsState] = useState([]);
  const [openRejectionModal, setOpenRejectionModal] = useState(false);
  const params = useParams();
  //status filter all "Draft", "Pending", "Public", "Rejected"
  const [status, setStatus] = useState("all");
  const [mealStatus, setMealStatus] = useState("all");
  const [dateFilter, setDateFilter] = useState(false);
  const [itemStatus, setItemStatus] = useState("all");
  const [categoryStatus, setCategoryStatus] = useState("all");

  const [descPage, setDescpage] = useState(1);
  const [descPages, setDescpages] = useState(1);

  const [mesrPage, setMesrpage] = useState(1);
  const [mesrPages, setMesrpages] = useState(1);

  const [catPage, setCatPage] = useState(1);
  const [catPages, setCatPages] = useState(1);

  const [storePage, setStorePage] = useState(1);
  const [storePages, setStorePages] = useState(1);
  //
  const [data, setData] = useState({
    meals: [],
    products: [],
    item: [],
  });
  const [allDescriptions, setAllDescriptions] = useState([]);
  const [allMeasurement, setAllMeasurement] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allStores, setAllStores] = useState([]);
  const [filter, setFilter] = useState({
    item_type: false,
    first_letter: false,
  });
  const [filteredItems, setFilteredItems] = useState({});
  const [filteredStores, setFilteredStores] = useState({});
  const [filteredDescription, setFilteredDescription] = useState({});
  const [filteredMesr, setFilteredMesr] = useState({});
  const [filteredCat, setFilteredCat] = useState({});

  useEffect(() => {
    getUserItems();
  }, [props.auth, filteredItems]);

  useEffect(() => {
    getAllDescriptions();
  }, [status, props.auth, filteredDescription]);

  useEffect(() => {
    getAllMeasurement();
  }, [mealStatus, props.auth, filteredMesr]);

  useEffect(() => {
    getAllCategories();
  }, [props.Auth, filteredCat]);

  useEffect(() => {
    getAllStores();
  }, [props.auth, filteredStores]);

  const getUserItems = (newPage, item_name = "") => {
    if (selectedUserType) {
      setSearchType("Item");
      let url;
      url = `/items/${newPage ? newPage : page}`;

      const params_ = {};

      for (let entry in filteredItems) {
        params_[entry] = filteredItems[entry];
      }
      console.log(selectedUserType, "props.auth.authUser");
      if (selectedUserType !== "admin") {
        // url = '/meals/get-meals/' + page + '?user=' + props.auth.authUser._id
        params_.user = props.auth.authUser?._id;
      }
      if (item_name) {
        params_.name = item_name;
      }

      axios
        .get(url, {
          params: params_,
        })
        .then((data) => {
          if (data.data.data) {
            setSuggestedCountState(data.data.data.count);
            setPagesState(Math.ceil(data.data.data.count / 10));
            const products = data.data.data.items?.filter(
              (ele) =>
                ele.item_type === "Product" || ele.item_type === "Products"
            );
            const utensils = data.data.data.items?.filter(
              (ele) =>
                ele.item_type === "Utensil" || ele.item_type === "Utensils"
            );
            const meals = data.data.data.items?.filter(
              (ele) => ele.item_type === "Meal" || ele.item_type === "Meals"
            );
            const item = data.data.data.items?.filter(
              (ele) =>
                ele.item_type === "Product" ||
                ele.item_type === "Meal" ||
                ele.item_type === "Utensil" ||
                ele.item_type === "Utensils" ||
                ele.item_type === "Meals" ||
                ele.item_type === "Products"
            );
            setData({ products, meals, item, utensils });
            setFilteredSuggestionsState(data.data.data);
            setSuggestionsState(data.data.data);
          }
        });
    }
  };

  const handleFilter = (key, value) => {
    setPageState(1);
    setFilteredItems({
      ...filteredItems,
      [key]: value,
    });
  };
  const handleCatFilter = (key, value) => {
    setCatPage(1);
    setFilteredCat({
      ...filteredCat,
      [key]: value,
    });
  };
  const handleFilterStores = (key, value) => {
    setStorePage(1);
    setFilteredStores({
      ...filteredStores,
      [key]: value,
    });
  };
  const handleFilteredDescription = (key, value) => {
    setDescpage(1);
    setFilteredDescription({
      ...filteredDescription,
      [key]: value,
    });
  };
  const handleFilteredMesr = (key, value) => {
    setMesrpage(1);
    setFilteredMesr({
      ...filteredMesr,
      [key]: value,
    });
  };
  const filterItemByDate = () => {
    let item = [];
    if (!dateFilter) {
      item = data.item.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setDateFilter(!dateFilter);
    } else {
      item = data.item.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setDateFilter(!dateFilter);
    }

    setData({
      ...data,
      item,
    });
  };

  const getAllDescriptions = async (newPage, name) => {
    try {
      const params_ = {};
      for (let entry in filteredDescription) {
        params_[entry] = filteredDescription[entry];
      }
      if (name) {
        params_.description_name = name;
      }

      const resp = await axios.get(
        `/description/${newPage ? newPage : descPage}?status=${status}`,
        {
          params: params_,
        }
      );
      if (Array.isArray(resp?.data?.data.description)) {
        setAllDescriptions(resp.data.data.description);
        setDescpages(Math.ceil(data.data.data.count / 10));
      }
    } catch (e) {
      console.log("err", e);
    }
  };

  const updateDescription = async (payload) => {
    try {
      const resp = await axios.patch("/description", payload);
      if (resp.data.status === 200) {
        toast.success("Decription status updated");
        getAllDescriptions();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const deleteDescription = async (id) => {
    try {
      const resp = await axios.delete(`/description/${id}`);
      if (resp.data.status === 200) {
        toast.success("Decription deleted");
        getAllDescriptions();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getAllMeasurement = async (newPage, name) => {
    try {
      const params_ = {};

      for (let entry in filteredMesr) {
        params_[entry] = filteredMesr[entry];
      }
      if (name) {
        params_.measurement_key = name;
      }
      const resp = await axios.get(
        `/measurement/${newPage ? newPage : mesrPage}?status=${mealStatus}`,
        {
          params: params_,
        }
      );
      if (Array.isArray(resp?.data?.data?.measurement)) {
        setAllMeasurement(resp.data.data?.measurement);
        setMesrpages(Math.ceil(resp.data.data.count / 10));
      }
    } catch (e) {
      console.log("err", e);
    }
  };

  const updateMeasurement = async (payload) => {
    try {
      const resp = await axios.post(`/measurement/update`, payload);
      if (resp.data.status === 200) {
        toast.success("Measurement updated");
        getAllMeasurement();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const deleteMeasurement = async (payload) => {
    try {
      const resp = await axios.post(`/measurement/delete`, payload);
      if (resp.data.status === 200) {
        toast.success("Measurement deleted");
        getAllMeasurement();
      }
    } catch (e) {
      console.log(e);
    }
  };
  const getAllCategories = async (newPage, name) => {
    try {
      const params = { ...filteredCat };
      if (name) {
        params.category_name = name;
      }
      const resp = await axios.get(
        `/categories/get-all-categories/${newPage ? newPage : catPage}`,
        {
          params: params,
        }
      );
      if (Array.isArray(resp?.data?.data.categories)) {
        setAllCategories(resp.data.data.categories);
        setCatPages(Math.ceil(data.data.data.count / 10));
      }
    } catch (e) {
      console.log("err", e);
    }
  };
  const handleCatNext = (lastPage = false) => {
    if (catPage !== catPages) {
      getAllCategories(lastPage ? catPages : catPage + 1);
      if (lastPage) {
        setCatPage(catPages);
      } else {
        setCatPage((prev) => prev + 1);
      }
    }
  };

  const handleCatPrev = (lastPage = false) => {
    if (catPage !== 1) {
      getAllCategories(lastPage ? 1 : catPage - 1);
      if (lastPage) {
        setCatPage(1);
      } else {
        setCatPage((prev) => prev - 1);
      }
    }
  };
  const updateCategory = async (id, payload) => {
    try {
      const resp = await axios.post(`/categories/update/${id}`, payload);

      toast.success("Category updated");
      getAllCategories();
    } catch (e) {
      console.log(e);
    }
  };
  const deleteCategory = async (id) => {
    try {
      const resp = await axios.delete(`/categories/delete-category/${id}`);
      toast.success("Category deleted successfully");
      getAllCategories();
    } catch (e) {
      console.log(e);
    }
  };
  const getAllStores = async (newPage, name) => {
    try {
      const params_ = {};

      for (let entry in filteredStores) {
        params_[entry] = filteredStores[entry];
      }
      if (name) {
        params_.store_key = name;
      }
      const resp = await axios.get(
        `/stores/getallstores/${newPage ? newPage : storePage}`,
        {
          params: params_,
        }
      );
      if (Array.isArray(resp?.data?.data.products)) {
        setAllStores(resp?.data?.data.products);

        setStorePages(Math.ceil(resp.data.data.count / 10));
      }
    } catch (e) {
      console.log("err", e);
    }
  };

  const handleStoreNext = (lastPage = false) => {
    if (storePage !== storePages) {
      getAllStores(lastPage ? storePages : storePage + 1);
      if (lastPage) {
        setStorePage(storePage);
      } else {
        setStorePage((prev) => prev + 1);
      }
    }
  };

  const handleStorePrev = (lastPage = false) => {
    if (storePage !== 1) {
      getAllStores(lastPage ? 1 : storePage - 1);
      if (lastPage) {
        setStorePage(1);
      } else {
        setStorePage((prev) => prev - 1);
      }
    }
  };
  const updateStoreStatus = async (type, storeId) => {
    try {
      setStoreStatus(type);
      const res = await axios.put(`/stores/updatestore/${storeId}`, {
        status: type,
      });
      toggleChangeStoreStatus();
      getAllStores();
      toast.success("Status successfully updated");
    } catch (e) {
      console.log(e, "errr");
    }
  };

  const deleteStore = async (id) => {
    try {
      const resp = await axios.delete(`/stores/deletestore/${id}`);
      toast.success("Store deleted successfully");
      getAllStores();
    } catch (e) {
      console.log(e);
    }
  };

  function togglePublicMeal() {
    setAddPublicMeal(!addPublicMeal);
  }

  function handleSearchType(type) {
    setSearchType(type);
    toggleSearchOption();
  }

  function handleSearchType2(type) {
    setSearchType(type);
    setPageState(1);
    let url;
    if (type === "Meal") {
      if (props.auth.authUser.user_type === "admin") {
        url = "/meals/get-meals/1";
      } else {
        url = "/meals/get-meals/1?user=" + props.auth.authUser._id;
      }
    } else if (type === "Product") {
      if (props.auth.authUser.user_type === "admin") {
        url = "/products/get-all-products/1";
      } else {
        url = "/products/get-all-products/1?user=" + props.auth.authUser._id;
      }
    } else {
      if (props.auth.authUser.user_type === "admin") {
        url = "/categories/get-all-categories/1";
      } else {
        url =
          "/categories/get-all-categories/1?user=" + props.auth.authUser._id;
      }
    }
    getSuggestion(url, type);
  }

  function toggleSearchOption() {
    setSearchOption(!searchOption);
  }

  function handleSearch(e) {
    setSearchSuggestedSuggestionState(e.target.value);
  }
  const searchSuggested = async (name) => {
    const user = localStorage.getItem("user") ?? {};

    if (searchType === "Item") {
      getUserItems(0, searchSuggestedSuggestion);
    } else if (searchType === "Store") {
      getAllStores(0, searchSuggestedSuggestion);
    } else if (searchType === "Category") {
      getAllCategories(0, searchSuggestedSuggestion);
    } else if (searchType === "Description") {
      getAllDescriptions(0, searchSuggestedSuggestion);
    } else if (searchType === "Measurement") {
      getAllMeasurement(0, searchSuggestedSuggestion);
    }
    try {
    } catch (error) {
      console.log(error);
    }
    return name;
  };

  // function searchSuggested(e) {
  //   let url;
  //   if (searchType === "Meal") {
  //     if (props.auth.authUser.user_type === "admin") {
  //       url = "/meals/get-meals/1?meal_name=" + searchSuggestedSuggestion;
  //     } else {
  //       url =
  //         "/meals/get-meals/1?user=" +
  //         props.auth.authUser._id +
  //         "&meal_name=" +
  //         searchSuggestedSuggestion;
  //     }
  //   } else if (searchType === "Product") {
  //     if (props.auth.authUser.user_type === "admin") {
  //       url =
  //         "/products/get-all-products/1?product_name=" +
  //         searchSuggestedSuggestion;
  //     } else {
  //       url =
  //         "/products/get-all-products/1?user=" +
  //         props.auth.authUser._id +
  //         "&product_name=" +
  //         searchSuggestedSuggestion;
  //     }
  //   } else {
  //     if (props.auth.authUser.user_type === "admin") {
  //       url =
  //         "/categories/get-all-categories/1?product_name=" +
  //         searchSuggestedSuggestion;
  //     } else {
  //       url =
  //         "/categories/get-all-categories/1?user=" +
  //         props.auth.authUser._id +
  //         "&product_name=" +
  //         searchSuggestedSuggestion;
  //     }
  //   }
  //   let url2;
  //   if (searchType === "Meal") {
  //     if (props.auth.authUser.user_type === "admin") {
  //       url2 = "/meals/get-meals/1";
  //     } else {
  //       url2 = "/meals/get-meals/1?user=" + props.auth.authUser._id;
  //     }
  //   } else if (searchType === "Product") {
  //     if (props.auth.authUser.user_type === "admin") {
  //       url2 = "/products/get-all-products/1";
  //     } else {
  //       url2 = "/products/get-all-products/1?user=" + props.auth.authUser._id;
  //     }
  //   } else {
  //     if (props.auth.authUser.user_type === "admin") {
  //       url2 = "/categories/get-all-categories/1";
  //     } else {
  //       url2 =
  //         "/categories/get-all-categories/1?user=" + props.auth.authUser._id;
  //     }
  //   }
  //   if (e.keyCode) {
  //     if (e.keyCode === 13) {
  //       if (searchSuggestedSuggestion.length >= 1) {
  //         axios.get(url).then((data) => {
  //           console.log(data.data);
  //           if (data.data.data) {
  //             setSuggestedCountState(data.data.data.count);
  //             if (data.data.data.count > 10) {
  //               setPagesState(Math.ceil(data.data.data.count / 10));
  //             }
  //             if (searchType === "Meal") {
  //               setFilteredSuggestionsState(data.data.data.meals);
  //               setSuggestionsState(data.data.data.meals);
  //             } else {
  //               setFilteredSuggestionsState(data.data.data.products);
  //               setSuggestionsState(data.data.data.products);
  //             }
  //           }
  //         });
  //       } else {
  //         getSuggestion(url2);
  //       }
  //     }
  //   } else {
  //     if (searchSuggestedSuggestion.length >= 1) {
  //       axios.get(url).then((data) => {
  //         console.log(data.data);
  //         if (data.data.data) {
  //           setSuggestedCountState(data.data.data.count);
  //           if (data.data.data.count > 10) {
  //             setPagesState(Math.ceil(data.data.data.count / 10));
  //           }
  //           if (searchType === "Meal") {
  //             setFilteredSuggestionsState(data.data.data.meals);
  //             setSuggestionsState(data.data.data.meals);
  //           } else {
  //             setFilteredSuggestionsState(data.data.data.products);
  //             setSuggestionsState(data.data.data.products);
  //           }
  //         }
  //       });
  //     } else {
  //       getSuggestion(url2);
  //     }
  //   }
  // }

  function searchRelated(e) {
    let searchVal = e.target.value;
    console.log(searchVal);
    let url;
    if (searchType === "Meal") {
      if (props.auth.authUser.user_type === "admin") {
        url =
          "/meals/get-meals/1?publicly_available=Public&meal_name=" + searchVal;
      } else {
        url =
          "/meals/get-meals/1?publicly_available=Public&user=" +
          props.auth.authUser._id +
          "&meal_name=" +
          searchVal;
      }
    } else if (searchType === "Product") {
      if (props.auth.authUser.user_type === "admin") {
        url =
          "/products/get-all-products/1?publicly_available=Public&product_name=" +
          searchVal;
      } else {
        url =
          "/products/get-all-products/1?publicly_available=Public&user=" +
          props.auth.authUser._id +
          "&product_name=" +
          searchVal;
      }
    }

    if (searchVal.length >= 1) {
      axios.get(url).then((data) => {
        console.log(data.data);
        if (data.data.data) {
          if (searchType === "Meal") {
            setRelatedsState(data.data.data.meals);
          } else {
            setRelatedsState(data.data.data.products);
          }
        }
      });
    }
  }

  function addRelated(val) {
    console.log(val);
    let url;
    let similar_meals;
    if (searchType === "Meal") {
      url = "/meals/update/";
      similar_meals = suggestion.similar_meals;
    } else if (searchType === "Product") {
      url = "/products/update/";
      similar_meals = suggestion.product_alternatives;
    } else {
      url = "/categories/update/";
    }

    if (val && val.length >= 1) {
      similar_meals.push(val.split("/")[1]);
      if (suggestion._id !== val.split("/")[1]) {
        let body;
        if (searchType === "Meal") {
          body = { similar_meals: similar_meals };
        } else if (searchType === "Product") {
          body = { product_alternatives: similar_meals };
        } else {
          url = "/categories/update/";
        }
        axios.post(url + suggestion._id, body).then((data) => {
          let meal = relateds.filter((rel) => rel._id === val.split("/")[1]);
          console.log(meal);
          similar_meals[similar_meals.length - 1] = meal[0];
          let url2;
          if (searchType === "Meal") {
            if (props.auth.authUser.user_type === "admin") {
              url2 = "/meals/get-meals/1";
            } else {
              url2 = "/meals/get-meals/1?user=" + props.auth.authUser._id;
            }
          } else if (searchType === "Product") {
            if (props.auth.authUser.user_type === "admin") {
              url2 = "/products/get-all-products/1";
            } else {
              url2 =
                "/products/get-all-products/1?user=" + props.auth.authUser._id;
            }
          } else {
            if (props.auth.authUser.user_type === "admin") {
              url2 = "/categories/get-all-categories/1";
            } else {
              url2 =
                "/categories/get-all-categories/1?user=" +
                props.auth.authUser._id;
            }
          }
          getSuggestion(url2, searchType);
        });
      } else {
        console.log("the same id");
      }
    }
  }

  function toggleSearch() {
    setSearchState(!search);
  }

  function toggleShowReason() {
    setShowReasonState(!showReason);
  }

  function toggleOpenMeal(meal) {
    console.log("meal", meal);
    setSuggestionState(meal);
    setOpenSuggestionState(true);
  }

  function closeSuggestion() {
    setOpenSuggestionState(false);
  }
  function closeStoreSuggestion() {
    setOpenStoreSuggestion(false);
  }
  function toggleChangeStatus() {
    setChangeStatusState(!changeStatus);
  }
  function toggleChangeStoreStatus() {
    setChangeStoreStatus(!changeStoreStatus);
  }

  const handleStatusType = async (type, id) => {
    try {
      setStatusTypeState(type);

      const res = await axios.post(`/items/item-control`, {
        itemId: id,
        status: type,
      });

      if (res.status === 200) {
        getUserItems(); // Fetch updated data
        toast.success("Item status successfully updated");
      }
    } catch (e) {
      console.error("Error updating status:", e);
      toast.error("Something went wrong");
    }
  };

  const handleSendForReview = async (id, type) => {
    try {
      setStatusTypeState(type);
      const res = await axios.post(`/items/item-control`, {
        itemId: id,
        status: type,
      });
      toggleChangeStatus();
      console.log("resss", res);
      if (res.status === 200) {
        getUserItems();
        toast.success("Item successfully sent for review");
      } else {
        toast.error("");
      }
    } catch (e) {
      console.log(e, "errr");
    }
  };

  function getSuggestion(url, searchTypeP = searchType) {
    axios.get(url).then((data) => {
      if (data.data.data) {
        console.log(data.data.data);
        setSuggestedCountState(data.data.data.count);
        if (data.data.data.count > 10) {
          setPagesState(Math.ceil(data.data.data.count / 10));
        } else {
          setPagesState(1);
        }
        console.log(searchTypeP);
        if (searchTypeP === "Meal") {
          console.log(data.data.meals);
          setFilteredSuggestionsState(data.data.data.meals);
          setSuggestionsState(data.data.data.meals);
        } else if (searchTypeP === "Product") {
          setFilteredSuggestionsState(data.data.data.products);
          setSuggestionsState(data.data.data.products);
        } else {
          setFilteredSuggestionsState(data.data.data.categories);
          setSuggestionsState(data.data.data.categories);
        }
      }
    });
  }

  function deleteSuggestion(id) {
    let url1;
    if (searchType === "Meal") {
      url1 = "/meals/delete/";
    } else if (searchType === "Product") {
      url1 = "/products/deleteproduct/";
    } else {
      url1 = "/categories/delete-category/";
    }
    axios
      .delete(url1 + id)
      .then((res) => {
        console.log(res.data);
        let url2;
        if (searchType === "Meal") {
          if (props.auth.authUser.user_type === "admin") {
            url2 = "/meals/get-meals/1";
          } else {
            url2 = "/meals/get-meals/1?user=" + props.auth.authUser._id;
          }
        } else if (searchType === "Product") {
          if (props.auth.authUser.user_type === "admin") {
            url2 = "/products/get-all-products/1";
          } else {
            url2 =
              "/products/get-all-products/1?user=" + props.auth.authUser._id;
          }
        } else {
          if (props.auth.authUser.user_type === "admin") {
            url2 = "/categories/get-all-categories/1";
          } else {
            url2 =
              "/categories/get-all-categories/1?user=" +
              props.auth.authUser._id;
          }
        }
        getSuggestion(url2);
      })
      .catch((error) => {
        setStatus2State("error");
        setMessageState("Suggestion not deleted");
        setTimeout(() => {
          setStatus2State("");
          setMessageState("");
        }, 5000);
      });
  }
  const deleteItem = async (id) => {
    try {
      const res = await axios.delete(`/items/delete/${id}`);
      console.log("resss", res);
      if (res.status === 202) {
        getUserItems();
        toast.success("Deleted successful");
      } else {
        toast.error("This Item does not exist!");
      }
    } catch (e) {
      console.log(e, "errr");
    }
  };

  function toggleTransferToInventory(meal) {
    setSuggestionState(meal);
    setTransferToInventoryState(!transferToInventory);
  }

  function toggleSent(id, searchType) {
    if (typeof id === "string") {
      let url1;
      if (searchType === "Meal") {
        url1 = "/meals/update/";
      } else if (searchType === "Product") {
        url1 = "/products/update/";
      } else {
        url1 = "/categories/update/";
      }
      axios.post(url1 + id, { publicly_available: "Pending" }).then((res) => {
        if (res.data.data) {
          let url2;
          if (searchType === "Meal") {
            if (props.auth.authUser.user_type === "admin") {
              url2 = "/meals/get-meals/1";
            } else {
              url2 = "/meals/get-meals/1?user=" + props.auth.authUser._id;
            }
          } else if (searchType === "Product") {
            if (props.auth.authUser.user_type === "admin") {
              url2 = "/products/get-all-products/1";
            } else {
              url2 =
                "/products/get-all-products/1?user=" + props.auth.authUser._id;
            }
          } else {
            if (props.auth.authUser.user_type === "admin") {
              url2 = "/categories/get-all-categories/1";
            } else {
              url2 =
                "/categories/get-all-categories/1?user=" +
                props.auth.authUser._id;
            }
          }
          getSuggestion(url2, searchType);
        }
      });
    }
    setSentState(!sent);
  }

  function handleSearchPublicSuggestion(e) {
    setSearchSuggestedSuggestionState(e.target.value);
    setSearchState(true);
    if (e.target.value.length >= 1) {
      let url;
      if (searchType === "Meal") {
        url = "/meals/get-meals/";
      } else {
        url = "/products/get-all-products/";
      }

      axios
        .get(
          url +
          "1?publicly_available=Public&" +
          (searchType === "Meal" ? "meal_name" : "product_name") +
          "=" +
          e.target.value
        )
        .then((data) => {
          console.log(data.data);
          if (data.data.data) {
            if (searchType === "Meal") {
              setPublicSuggestionsState(data.data.data.meals);
            } else {
              setPublicSuggestionsState(data.data.data.products);
            }
          }
        });
    }
  }

  function addSuggestion(suggestion) {
    suggestion.user = props.auth.authUser._id;
    suggestion.chef = props.auth.authUser.username;
    suggestion.publicly_available = "Draft";
    let newSuggestions = suggestions;
    delete suggestion._id;
    delete suggestion.createdAt;
    let url;
    if (searchType === "Meal") {
      url = "/meals/create";
    } else {
      url = "/products/create";
    }
    axios
      .post(url, suggestion)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          console.log(response.data);
          newSuggestions.push(response.data.data);
          setSuggestionsState(newSuggestions);
          setStatus2State("success");
          setMessageState("Suggestion added");
          setTimeout(() => {
            setStatus2State("");
            setMessageState("");
          }, 5000);
          setFilteredSuggestionsState(newSuggestions);
        } else {
          setStatus2State("error");
          setMessageState("Suggestion not added");
          setTimeout(() => {
            setStatus2State("");
            setMessageState("");
          }, 5000);
        }
      })
      .catch((error) => {
        setStatus2State("error");
        setMessageState("Suggestion not added");
        setTimeout(() => {
          setStatus2State("");
          setMessageState("");
        }, 5000);
      });
  }

  function openMealDetailsModal(meal) {
    setSuggestionState(meal);
    // if (meal.formatted_ingredients?.length > 0) {
    //     // let ingredients = JSON.parse(meal.formatted_ingredients[0]);
    //     let ingredients = meal.formatted_ingredients
    //     var ingredientsString = []
    //     for (let i = 0; i < ingredients.length; i++) {
    //         let properIngredientStringSyntax = ''
    //         if (ingredients[i].quantity === "") {
    //             properIngredientStringSyntax = ingredients[i].productName;
    //         } else if (ingredients[i].measurement === "" && ingredients[i].quantity !== "") {
    //             // MAKE sure we are using the right and tested variables to display the right type of string at all times.
    //             properIngredientStringSyntax = "" + ingredients[i].quantity + " " + ingredients[i].productName;
    //         } else {
    //             properIngredientStringSyntax =
    //                 "" + ingredients[i].quantity + " " + ingredients[i].measurement +
    //                 " of " + ingredients[i].productName;
    //         }
    //         ingredientsString.push(properIngredientStringSyntax)
    //     }
    //     console.log(ingredientsString)
    //     setIngredientsString(ingredientsString)
    // }
    setIngredientsString(meal.formatted_ingredients);

    setOpenModalState(true);
    // console.log(typeof suggestion.formatted_instructions[0], "find instructionss")
    // console.log(eval('(' + suggestion.instructions + ')'), "help")
    console.log(suggestion.ingredeints_in_item, "suggy");
    // console.log(suggestion.instructions, "wordlength")
    // console.log(suggestion.id, "show the id")
  }

  function openDetailsModal(product) {
    // if(searchType == 'Product'){
    setSuggestionState(product);

    setSuggestionState(product);
    // let ingredients = product.ingredients_in_product;
    // var ingredientsString = []
    // for (let i = 0; i < ingredients.length; i++) {
    //     let properIngredientStringSyntax = ''
    //     if (ingredients[i].quantity === "") {
    //         properIngredientStringSyntax = ingredients[i].productName;
    //     } else if (ingredients[i].measurement === "" && ingredients[i].quantity !== "") {
    //         // MAKE sure we are using the right and tested variables to display the right type of string at all times.
    //         properIngredientStringSyntax = "" + ingredients[i].quantity + " " + ingredients[i].productName;
    //     } else {
    //         properIngredientStringSyntax =
    //             "" + ingredients[i].quantity + " " + ingredients[i].measurement +
    //             " of " + ingredients[i].productName;
    //     }
    //     ingredientsString.push(properIngredientStringSyntax)
    // }
    setIngredientsString(product.formatted_ingredients);

    setOpenModal2State(true);
    // }
  }

  function closeModal() {
    setOpenModalState(false);
    setOpenModal2State(false);
  }

  async function nextPage(newPage = page + 1) {
    if (page < pages) {
      setPageState(newPage);
      let url;
      if (searchType === "Meal") {
        if (props.auth.authUser.user_type === "admin") {
          url = "/meals/get-meals/" + newPage;
        } else {
          url =
            "/meals/get-meals/" + newPage + "?user=" + props.auth.authUser._id;
        }
      } else if (searchType === "Product") {
        if (props.auth.authUser.user_type === "admin") {
          url = "/products/get-all-products/" + newPage;
        } else {
          url =
            "/products/get-all-products/" +
            newPage +
            "?user=" +
            props.auth.authUser._id;
        }
      } else {
        if (props.auth.authUser.user_type === "admin") {
          url = "/categories/get-all-categories/" + newPage;
        } else {
          url =
            "/categories/get-all-categories/" +
            newPage +
            "?user=" +
            props.auth.authUser._id;
        }
      }
      axios.get(url).then((data) => {
        console.log(data.data);
        if (data.data.data) {
          setSuggestedCountState(data.data.data.count);
          if (data.data.data.count > 10) {
            setPagesState(Math.ceil(data.data.data.count / 10));
          }
          if (searchType === "Meal") {
            setFilteredSuggestionsState(data.data.data.meals);
            setSuggestionsState(data.data.data.meals);
          } else if (searchType === "Product") {
            setFilteredSuggestionsState(data.data.data.products);
            setSuggestionsState(data.data.data.products);
          } else {
            setFilteredSuggestionsState(data.data.data.categories);
            setSuggestionsState(data.data.data.categories);
          }
        }
      });
    }
  }

  async function prevPage(newPage = page - 1) {
    if (page > 1) {
      setPageState(newPage);
      let url;
      if (searchType === "Meal") {
        if (props.auth.authUser.user_type === "admin") {
          url = "/meals/get-meals/" + newPage;
        } else {
          url =
            "/meals/get-meals/" + newPage + "?user=" + props.auth.authUser._id;
        }
      } else if (searchType === "Product") {
        if (props.auth.authUser.user_type === "admin") {
          url = "/products/get-all-products/" + newPage;
        } else {
          url =
            "/products/get-all-products/" +
            newPage +
            "?user=" +
            props.auth.authUser._id;
        }
      } else {
        if (props.auth.authUser.user_type === "admin") {
          url = "/categories/get-all-categories/" + newPage;
        } else {
          url =
            "/categories/get-all-categories/" +
            newPage +
            "?user=" +
            props.auth.authUser._id;
        }
      }
      axios.get(url).then((data) => {
        console.log(data.data);
        if (data.data.data) {
          setSuggestedCountState(data.data.data.count);
          if (data.data.data.count > 10) {
            setPagesState(Math.ceil(data.data.data.count / 10));
          }
          if (searchType === "Meal") {
            setFilteredSuggestionsState(data.data.data.meals);
            setSuggestionsState(data.data.data.meals);
          } else if (searchType === "Product") {
            setFilteredSuggestionsState(data.data.data.products);
            setSuggestionsState(data.data.data.products);
          } else {
            setFilteredSuggestionsState(data.data.data.categories);
            setSuggestionsState(data.data.data.categories);
          }
        }
      });
    }
  }

  const handleNext = (lastPage = false) => {
    if (page <= pages) {
      getUserItems(lastPage ? pages : page + 1);
      if (lastPage) {
        setPageState(pages);
      } else {
        setPageState((prev) => prev + 1);
      }
    }
  };

  const handlePrev = (lastPage = false) => {
    if (page !== 1) {
      getUserItems(lastPage ? 1 : page - 1);
      if (lastPage) {
        setPageState(1);
      } else {
        setPageState((prev) => prev - 1);
      }
    }
  };

  const handleDescNext = (lastPage = false) => {
    if (descPage !== descPages) {
      getAllDescriptions(lastPage ? descPages : descPage + 1);
      if (lastPage) {
        setDescpage(descPages);
      } else {
        setDescpage((prev) => prev + 1);
      }
    }
  };

  const handleDescPrev = (lastPage = false) => {
    if (descPage !== 1) {
      getAllDescriptions(lastPage ? 1 : descPage - 1);
      if (lastPage) {
        setDescpage(1);
      } else {
        setDescpage((prev) => prev - 1);
      }
    }
  };

  const handleMesrNext = (lastPage = false) => {
    if (mesrPage !== mesrPages) {
      getAllMeasurement(lastPage ? mesrPages : mesrPage + 1);
      if (lastPage) {
        setMesrpage(mesrPages);
      } else {
        setMesrpage((prev) => prev + 1);
      }
    }
  };

  const handleMesrPrev = (lastPage = false) => {
    if (mesrPage !== 1) {
      getAllMeasurement(lastPage ? 1 : mesrPage - 1);
      if (lastPage) {
        setMesrpage(1);
      } else {
        setMesrpage((prev) => prev - 1);
      }
    }
  };

  const handleSort = () => {
    const resp = data.item.sort((a, b) => {
      const statusOrder = { Pending: 0, Rejected: 1, Draft: 2, Public: 3 };
      const statusA = statusOrder[a.status] || Infinity;
      const statusB = statusOrder[b.status] || Infinity;
      return statusA - statusB;
    });
    setData({ ...data, item: resp });
  };

  const handleFilterByType = () => {
    const meals_first = data.item.filter((ele) => ele.item_type === "Meal");
    const product_first = data.item.filter(
      (ele) => ele.item_type === "Product"
    );

    if (filter.item_type) {
      setData({ ...data, item: [...meals_first, ...product_first].reverse() });
      setFilter({ ...filter, item_type: !filter.item_type });
    } else {
      setData({ ...data, item: [...product_first, ...meals_first].reverse() });
      setFilter({ ...filter, item_type: !filter.item_type });
    }
  };

  const handleFilterFirstLetter = () => {
    if (filter.first_letter) {
      const sorted = data.item.sort((a, b) => {
        const itemA = a["item_name"].toLowerCase();
        const itemB = b["item_name"].toLowerCase();
        return itemA.localeCompare(itemB);
      });
      setData({ ...data, item: sorted });
      setFilter({ ...filter, first_letter: !filter.first_letter });
    } else {
      const sorted = data.item.sort((a, b) => {
        const itemA = a["item_name"].toLowerCase();
        const itemB = b["item_name"].toLowerCase();
        return itemB.localeCompare(itemA);
      });
      setData({ ...data, item: sorted });
      setFilter({ ...filter, first_letter: !filter.first_letter });
    }
  };

  const handleStatus = () => {
    // setItemStatus('Pending')

    if (itemStatus === "Pending") {
      const pending = [];
      const notPending = [];
      for (let ele of data.item) {
        if (ele.item_status[0].status === "Pending") {
          pending.push(ele);
        } else {
          notPending.push(ele);
        }
      }
      setData({ ...data, item: [...pending, ...notPending].reverse() });
      setItemStatus("Rejected");
    } else if (itemStatus === "Rejected") {
      const rejected = [];
      const notRejected = [];
      for (let ele of data.item) {
        if (ele.item_status[0].status === "Rejected") {
          rejected.push(ele);
        } else {
          notRejected.push(ele);
        }
      }
      setData({ ...data, item: [...rejected, ...notRejected].reverse() });
      setItemStatus("Draft");
    } else if (itemStatus === "Draft") {
      const draft = [];
      const notDraft = [];
      for (let ele of data.item) {
        if (ele.item_status[0].status === "Draft") {
          draft.push(ele);
        } else {
          notDraft.push(ele);
        }
      }
      setData({ ...data, item: [...draft, ...notDraft].reverse() });
      setItemStatus("Public");
    } else if (itemStatus === "Public") {
      const public_ = [];
      const notPublic = [];
      for (let ele of data.item) {
        if (ele.item_status[0].status === "Public") {
          public_.push(ele);
        } else {
          notPublic.push(ele);
        }
      }
      setData({ ...data, item: [...public_, ...notPublic].reverse() });
      setItemStatus("Pending");
    } else {
      setItemStatus("Pending");
    }
  };
  // console.log(suggestion.prepime, 'prep time not showing')
  const selectedUserType = useSelector(
    (state) => state.userType.selectedUserType
  );

  return (
    <div className={container + " " + col2}>
      <div className="alert">
        {status2 === "error" && <div className="alert-danger">{message}</div>}
        {status2 === "success" && (
          <div className="alert-success">{message}</div>
        )}
      </div>
      <Header />
      <SideNav />
      <div className={left}>
        <Sidenav2 showBottom={false} />
      </div>
      <div className={empty}></div>
      <div className={center}>
        {!openSuggestion && (
          <>
            <h3>Suggested Meal/Products</h3>
            {props.auth.authUser && (
              <div className={styles.suggestedmeal_container}>
                <div className={styles.suggestedmeal_search_con}>
                  {searchType === "Item" && (
                    <div className={styles.search_con}>
                      <div className={styles.search_box}>
                        <p
                          onClick={searchSuggested}
                          className={styles.search_icon}
                        >
                          <SearchIcon className={styles.search_icon} />
                        </p>
                        <input
                          type="text"
                          name="search"
                          onChange={handleSearch}
                          // onKeyUp={searchSuggested}
                          className={styles.search_input}
                          placeholder="Search for products"
                        />
                      </div>
                      <div
                        className={styles.search_button}
                        onClick={searchSuggested}
                      >
                        Search
                      </div>
                    </div>
                  )}
                  {searchType === "Category" && (
                    <div className={styles.search_con}>
                      <div className={styles.search_box}>
                        <p
                          // onClick={searchSuggested}
                          className={styles.search_icon}
                        >
                          <SearchIcon className={styles.search_icon} />
                        </p>
                        <input
                          type="text"
                          name="search"
                          onChange={handleSearch}
                          // onKeyUp={searchSuggested}
                          className={styles.search_input}
                          placeholder="Search for category"
                        />
                      </div>
                      <div
                        className={styles.search_button}
                        onClick={searchSuggested}
                      >
                        Search
                      </div>
                    </div>
                  )}
                  {searchType === "Store" && (
                    <div className={styles.search_con}>
                      <div className={styles.search_box}>
                        <p
                          // onClick={searchSuggested}
                          className={styles.search_icon}
                        >
                          <SearchIcon className={styles.search_icon} />
                        </p>
                        <input
                          type="text"
                          name="search"
                          onChange={handleSearch}
                          // onKeyUp={searchSuggested}
                          className={styles.search_input}
                          placeholder="Search for store"
                        />
                      </div>
                      <div
                        className={styles.search_button}
                        onClick={searchSuggested}
                      >
                        Search
                      </div>
                    </div>
                  )}
                  {searchType === "Description" && (
                    <div className={styles.search_con}>
                      <div className={styles.search_box}>
                        <p
                          // onClick={searchSuggested}
                          className={styles.search_icon}
                        >
                          <SearchIcon className={styles.search_icon} />
                        </p>
                        <input
                          type="text"
                          name="search"
                          onChange={handleSearch}
                          // onKeyUp={searchSuggested}
                          className={styles.search_input}
                          placeholder="Search for description"
                        />
                      </div>
                      <div
                        className={styles.search_button}
                        onClick={searchSuggested}
                      >
                        Search
                      </div>
                    </div>
                  )}
                  {searchType === "Measurement" && (
                    <div className={styles.search_con}>
                      <div className={styles.search_box}>
                        <p
                          // onClick={searchSuggested}
                          className={styles.search_icon}
                        >
                          <SearchIcon className={styles.search_icon} />
                        </p>
                        <input
                          type="text"
                          name="search"
                          onChange={handleSearch}
                          // onKeyUp={searchSuggested}
                          className={styles.search_input}
                          placeholder="Search for measurement"
                        />
                      </div>
                      <div
                        className={styles.search_button}
                        onClick={searchSuggested}
                      >
                        Search
                      </div>
                    </div>
                  )}
                  {props.auth.authUser.user_type.includes("customer") ===
                    "customer" && (
                      <Link href="/dashboard/createstore">Create Store</Link>
                    )}
                </div>
                <div className={styles.suggestedmeal_row2}>
                  <div className={styles.mode_con}>
                    <div
                      onClick={() => handleSearchType2("Item")}
                      className={
                        styles.mode +
                        " " +
                        styles.left_mode +
                        " " +
                        (searchType === "Item" ? styles.active_mode : "")
                      }
                    >
                      Item
                    </div>
                    <div
                      onClick={() => handleSearchType2("Category")}
                      className={
                        styles.mode +
                        " " +
                        styles.right_mode +
                        " " +
                        (searchType === "Category" ? styles.active_mode : "")
                      }
                    >
                      Category
                    </div>
                    {selectedUserType === "admin" && (
                      <>
                        <div
                          onClick={() => handleSearchType2("Description")}
                          className={
                            styles.mode +
                            " " +
                            styles.right_mode +
                            " " +
                            (searchType === "Description"
                              ? styles.active_mode
                              : "")
                          }
                        >
                          Description
                        </div>
                        <div
                          onClick={() => handleSearchType2("Measurement")}
                          className={
                            styles.mode +
                            " " +
                            styles.right_mode +
                            " " +
                            (searchType === "Measurement"
                              ? styles.active_mode
                              : "")
                          }
                        >
                          Measurement
                        </div>
                        <div
                          onClick={() => handleSearchType2("Store")}
                          className={
                            styles.mode +
                            " " +
                            styles.right_mode +
                            " " +
                            (searchType === "Store" ? styles.active_mode : "")
                          }
                        >
                          Store
                        </div>
                      </>
                    )}
                  </div>
                  {selectedUserType !== "admin" && (
                    <div className={styles.suggestedmeal_row2_col2}>
                      {/* <h5>Remove Sections(s)</h5> */}
                      <div>
                        {/* <div onClick={togglePublicMeal} className={styles.tableactionbutton}>+ Add public meal</div> */}
                        <div className={styles.tableactionbutton}>
                          <Link href="/suggestmeal">+ New Suggestion</Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.suggestedmeal}>
                  <table style={{ width: "100%" }}>
                    {searchType !== "Description" &&
                      searchType !== "Measurement" &&
                      searchType !== "Store" &&
                      searchType !== "Category" && (
                        <div>
                          <div
                            className={
                              selectedUserType === "supplier"
                                ? styles.request_tr
                                : styles.request_tr1
                            }
                          >
                            {/* <input name='id' type="checkbox" /> */}
                            {/* <p className={styles.request_th}>ID number</p> */}
                            <p
                              // onClick={handleFilterFirstLetter}
                              onClick={() => {
                                handleFilter(
                                  "item_name",
                                  Number(filteredItems?.item_name) === 1
                                    ? -1
                                    : 1
                                );
                              }}
                              className={styles.request_th}
                            >
                              Name <FillterIcon />
                            </p>
                            <p
                              className={styles.request_th + " " + styles.hide}
                              // onClick={handleFilterByType}
                              onClick={() => {
                                let item_types = "Product";
                                if (router?.query.item_type === "Product") {
                                  item_types = "Meal";
                                } else if (router?.query.item_type === "Meal") {
                                  item_types = "Utensil";
                                } else if (
                                  router?.query.item_type === "Utensil"
                                ) {
                                  item_types = "Product";
                                }
                                router.push({
                                  pathname: router.pathname,
                                  query: {
                                    ...router.query,
                                    item_type: item_types,
                                  },
                                });
                                handleFilter("type", item_types);
                              }}
                            >
                              Item Type <FillterIcon />
                            </p>
                            <p
                              className={styles.request_th}
                              // onClick={handleStatus}
                              onClick={() => {
                                let item_status = "Public";
                                if (router?.query.item_status === "Public") {
                                  item_status = "Draft";
                                } else if (
                                  router?.query.item_status === "Draft"
                                ) {
                                  item_status = "Pending";
                                } else if (
                                  router?.query.item_status === "Pending"
                                ) {
                                  item_status = "Rejected";
                                } else if (
                                  router?.query.item_status === "Rejected"
                                ) {
                                  item_status = "Public";
                                }
                                router.push({
                                  pathname: router.pathname,
                                  query: {
                                    ...router.query,
                                    item_status,
                                  },
                                });
                                handleFilter("status", item_status);
                              }}
                              style={{ display: "flex", cursor: "pointer" }}
                            >
                              Status <FillterIcon />
                            </p>
                            <p
                              className={
                                styles.request_th + " " + styles.hideData
                              }
                            >
                              Categories
                            </p>

                            <p
                              // onClick={filterItemByDate}
                              onClick={() => {
                                handleFilter(
                                  "createdAt",
                                  Number(filteredItems?.createdAt) === 1
                                    ? -1
                                    : 1
                                );
                              }}
                              className={
                                styles.request_th + " " + styles.hideData
                              }
                            >
                              Date Created <FillterIcon />
                            </p>
                            <p className={styles.request_th}>Action</p>
                          </div>
                        </div>
                      )}
                    <div>
                      {searchType === "Item" && (
                        <>
                          {data.item &&
                            data.item.map((suggestion) => {
                              return (
                                <SuggestedMealRow
                                  searchType={searchType}
                                  deleteSuggestion={deleteSuggestion}
                                  toggleSent={toggleSent}
                                  toggleTransferToInventory={
                                    toggleTransferToInventory
                                  }
                                  openMealDetailsModal={(data) =>
                                    suggestion?.item_type === "Meal"
                                      ? openMealDetailsModal(data)
                                      : openDetailsModal(data)
                                  }
                                  openDetailsModal={(data) =>
                                    suggestion?.item_type === "Meal"
                                      ? openMealDetailsModal(data)
                                      : openDetailsModal(data)
                                  }
                                  auth={props.auth}
                                  key={suggestion._id}
                                  suggestion={suggestion}
                                  toggleOpenMeal={toggleOpenMeal}
                                  deleteItem={deleteItem}
                                  handleSendForReview={handleSendForReview}
                                  handleStatusType={(type) => handleStatusType(type, suggestion)}
                                />
                              );
                            })}
                        </>
                      )}

                      {searchType === "Product" && (
                        <>
                          {data.products &&
                            data.products.reverse().map((suggestion) => {
                              return (
                                <SuggestedProductRow
                                  searchType={searchType}
                                  deleteSuggestion={deleteSuggestion}
                                  toggleSent={toggleSent}
                                  toggleTransferToInventory={
                                    toggleTransferToInventory
                                  }
                                  openMealDetailsModal={openDetailsModal}
                                  openDetailsModal={openDetailsModal}
                                  auth={props.auth}
                                  key={suggestion._id}
                                  suggestion={suggestion}
                                  toggleOpenMeal={toggleOpenMeal}
                                  deleteItem={deleteItem}
                                  handleSendForReview={handleSendForReview}
                                />
                              );
                            })}
                        </>
                      )}

                      {selectedUserType && (
                        <>
                          {searchType === "Description" && (
                            <SuggestedDescription
                              updateDescription={updateDescription}
                              deleteDescription={deleteDescription}
                              descriptions={allDescriptions}
                              status={status}
                              filteredDescription={filteredDescription}
                              setFilteredDescription={setFilteredDescription}
                              handleFilteredDescription={
                                handleFilteredDescription
                              }
                              setStatus={setStatus}
                            />
                          )}
                          {searchType === "Measurement" && (
                            <SuggestedMeasurement
                              deleteMeasurement={deleteMeasurement}
                              updateMeasurement={updateMeasurement}
                              measurements={allMeasurement}
                              status={mealStatus}
                              filteredMesr={filteredMesr}
                              setFilteredMesr={setFilteredMesr}
                              handleFilteredMesr={handleFilteredMesr}
                              setStatus={setMealStatus}
                            />
                          )}
                          {searchType === "Category" && (
                            <SuggestedCategories
                              categories={allCategories}
                              status={categoryStatus}
                              setStatus={setCategoryStatus}
                              updateCategory={updateCategory}
                              deleteCategory={deleteCategory}
                              filteredCat={filteredCat}
                              handleCatFilter={handleCatFilter}
                            />
                          )}
                          {searchType === "Store" && (
                            <SuggestedStores
                              setStoreStatus={setStoreStatus}
                              storeStatus={storeStatus}
                              changeStoreStatus={changeStoreStatus}
                              toggleChangeStoreStatus={toggleChangeStoreStatus}
                              allstores={allStores}
                              filteredStores={filteredStores}
                              setFilteredStores={setFilteredStores}
                              handleFilterStores={handleFilterStores}
                              deleteStore={deleteStore}
                              updateStoreStatus={updateStoreStatus}
                              openStoreSuggestion={openStoreSuggestion}
                              setOpenStoreSuggestion={setOpenStoreSuggestion}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </table>
                  <div className={styles.user_pagination}>
                    <div>
                      {
                        <>
                          <p
                            onClick={() => {
                              if (searchType === "Item") {
                                handlePrev(true);
                              } else if (searchType === "Description") {
                                handleDescPrev(true);
                              } else if (searchType === "Measurement") {
                                handleMesrPrev(true);
                              } else if (searchType === "Category") {
                                handleCatPrev(true);
                              } else if (searchType === "Store") {
                                handleStorePrev(true);
                              }
                            }}
                            className={styles.paginate_btn}
                          >
                            &lt;&lt;
                          </p>

                          <p
                            onClick={() => {
                              if (searchType === "Item") {
                                handlePrev();
                              } else if (searchType === "Description") {
                                handleDescPrev();
                              } else if (searchType === "Measurement") {
                                handleMesrPrev();
                              } else if (searchType === "Category") {
                                handleCatPrev();
                              } else if (searchType === "Store") {
                                handleStorePrev();
                              }
                            }}
                            className={styles.paginate_btn}
                          >
                            &lt;&lt;
                          </p>
                        </>
                      }

                      {
                        <>
                          <p
                            onClick={() => {
                              if (searchType === "Item") {
                                handleNext();
                              } else if (searchType === "Description") {
                                handleDescNext();
                              } else if (searchType === "Measurement") {
                                handleMesrNext();
                              } else if (searchType === "Category") {
                                handleCatNext();
                              } else if (searchType === "Store") {
                                handleStoreNext();
                              }
                            }}
                            className={styles.paginate_btn}
                          >
                            &gt;&gt;
                          </p>

                          <p
                            onClick={() => {
                              if (searchType === "Item") {
                                handleNext(true);
                              } else if (searchType === "Description") {
                                handleDescNext(true);
                              } else if (searchType === "Measurement") {
                                handleMesrNext(true);
                              } else if (searchType === "Category") {
                                handleCatNext(true);
                              } else if (searchType === "Store") {
                                handleStoreNext(true);
                              }
                            }}
                            className={styles.paginate_btn}
                          >
                            &gt;&gt;
                          </p>
                        </>
                      }
                    </div>
                    <p>
                      {searchType === "Item" ? (
                        <>{"" + page + " of " + pages}</>
                      ) : searchType === "Description" ? (
                        <>{"" + descPage + " of " + descPages}</>
                      ) : searchType === "Measurement" ? (
                        <>{"" + mesrPage + " of " + mesrPages}</>
                      ) : searchType === "Category" ? (
                        <>{"" + catPage + " of " + catPages}</>
                      ) : searchType === "Store" ? (
                        <>{"" + storePage + " of " + storePages}</>
                      ) : null}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        {openSuggestion && (
          <div style={{ width: "100%" }}>
            <div className={styles.meal_section_1}>
              <div className={styles.meal_section_1_col_1}>
                <ul className={styles.goback_header_pages}>
                  <div onClick={closeSuggestion}>
                    <WestIcon className={styles.goback_header_page_arrow} />
                  </div>
                  <li onClick={closeSuggestion}>back</li>
                </ul>
              </div>
            </div>
            <div className={styles.meal_section_1}>
              <div className={styles.meal_section_1_col_1}>
                <h3>{searchType + " "} Description</h3>
              </div>
              <div className={styles.meal_section_1_col_2}>
                {/* <p className={styles.meal_section_1_col_2_p}> Choose type</p> */}
                <div className={styles.select_container}>
                  <div
                    onClick={toggleChangeStatus}
                    className={styles.select_box}
                  >
                    <p>
                      {statusType.length > 0
                        ? statusType
                        : suggestion.publicly_available}
                    </p>
                    <ArrowDropDownIcon className={styles.select_box_icon} />
                  </div>
                  {changeStatus && (
                    <div className={styles.select_options2}>
                      <p onClick={() => handleStatusType("Public", suggestion._id)}>Public</p>
                      <p onClick={() => handleStatusType("Pending", suggestion._id)}>Pending</p>
                      <p onClick={() => setOpenRejectionModal(true)}>
                        Rejected
                      </p>
                    </div>
                  )}
                </div>
                <p
                  className={
                    status +
                    " " +
                    (suggestion.publicly_available === "Draft" ||
                      suggestion.publicly_available === "Pending"
                      ? pending
                      : suggestion.publicly_available === "Public"
                        ? approve
                        : suggestion.publicly_available === "Rejected"
                          ? rejected
                          : "")
                  }
                >
                  {suggestion.publicly_available}
                </p>

                <div className={styles.status}>
                  {suggestion.item_status.map((elem) => (
                    <p
                      className={
                        elem.status === "Public"
                          ? styles.statusText
                          : elem.status === "Pending"
                            ? styles.statusText2
                            : elem.status === "Rejected"
                              ? styles.rejected
                              : styles.statusText2
                      }
                    >
                      {elem.status}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            {searchType === "Item" ? (
              <Meal
                meal={suggestion}
                auth={props.auth}
                show={false}
                handleStatusType={handleStatusType}
              />
            ) : (
              searchType === "Product" && (
                <Product product={suggestion} auth={props.auth} />
              )
            )}

            {searchType === "Item" && (
              <div className={styles.form_group}>
                {/* <h3>Upload Background Picture</h3> */}
                <div className={styles.search_con}>
                  {/* <div className={styles.search_box}> */}
                  {/* <p onClick={searchSuggested} className={styles.search_icon}>
                                    <SearchIcon className={styles.search_icon} />
                                </p> */}
                  <Autocomplete
                    id="tags-outlined"
                    freeSolo
                    // filterSelectedOptions
                    options={relateds.map(
                      (option) => option.meal_name + "/" + option._id
                    )}
                    // onChange={(ev,val)=>this.handleCategoryDropdownChange(ev,val)}
                    onChange={(e, newValue) => addRelated(newValue)}
                    // getOptionLabel={option => option}
                    // renderTags={() => {}}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={(e) => searchRelated(e)}
                        variant="outlined"
                        placeholder="Search for related"
                        fullWidth
                      />
                    )}
                  />
                  {/* <input
                                type="text"
                                name="search"
                                onChange={searchRelated}
                                className={styles.search_input}
                                placeholder="Search for related"
                                /> */}
                  {/* </div> */}
                  <div className={styles.search_button}>Search</div>
                </div>
                <div className={suggestion_form_image}>
                  <div className={suggestion_form_image_col_1}>
                    {suggestion.similar_meals?.map((images, index) => {
                      <Image
                        key={index}
                        width={300}
                        height={300}
                        src={images}
                        alt="background"
                      />;
                    })}

                    {/* <div className={suggestion_form_image_icon_con}>
                                    <AddIcon className={suggestion_form_image_icon} />
                                </div> */}
                  </div>
                </div>
              </div>
            )}
            {searchType === "Product" && (
              <div className={styles.form_group}>
                {/* <h3>Upload Background Picture</h3> */}
                <div className={styles.search_con}>
                  {/* <div className={styles.search_box}> */}
                  {/* <p onClick={searchSuggested} className={styles.search_icon}>
                                    <SearchIcon className={styles.search_icon} />
                                </p> */}
                  <Autocomplete
                    id="tags-outlined"
                    freeSolo
                    // filterSelectedOptions
                    options={relateds.map(
                      (option) => option.product_name + "/" + option._id
                    )}
                    // onChange={(ev,val)=>this.handleCategoryDropdownChange(ev,val)}
                    onChange={(e, newValue) => addRelated(newValue)}
                    // getOptionLabel={option => option}
                    // renderTags={() => {}}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={(e) => searchRelated(e)}
                        variant="outlined"
                        placeholder="Search for related"
                        fullWidth
                      />
                    )}
                  />
                  <div className={styles.search_button}>Search</div>
                </div>
                <div className={suggestion_form_image}>
                  <div className={suggestion_form_image_col_1}>
                    {suggestion.product_alternatives?.map((images, index) => {
                      <Image
                        key={index}
                        width={300}
                        height={300}
                        src={images}
                        alt="background"
                      />;
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {openRejectionModal && (
        <RejectionModal
          itemId={suggestion._id ?? ""}
          setOpenModal={setOpenRejectionModal}
        />
      )}
      {openModal && (
        <Popup2
          popupType="Meal Suggestion Preview"
          openModal={openModal}
          closeModal={closeModal}
          name={suggestion.item_name}
          description={suggestion.item_intro}
          imageData={suggestion.item_images[0]}
          imagesData={suggestion.item_images}
          image={suggestion.item_images[0]}
          // imagesData={suggestion.meal_images.slice(1)} categories={JSON.parse(suggestion.meal_categories).toString().split(',')}
          prepTime={suggestion.meal_prep_time}
          cookTime={suggestion.meal_cook_time}
          serves={suggestion.meal_servings}
          chef={suggestion.meal_chef}
          isDashboard={true}
          // ingredientsList={
          //     suggestion.formatted_ingredients?.length
          //         ? suggestion.formatted_ingredients
          //         : []}
          ingredientsInItem={suggestion.ingredeints_in_item}
          utensilsList={suggestion.meal_kitchen_utensils}
          //   ingredientsList={suggestion.formatted_ingredients.map(ingredient => JSON.parse(ingredient).properIngredientStringSyntax)} utensilsList={suggestion.kitchen_utensils}
          instructionChunk1={suggestion.meal_formatted_instructions[0]?.title}
          instructionChunk2={suggestion.meal_formatted_instructions[1]?.title}
          instructionChunk3={suggestion.meal_formatted_instructions[2]?.title}
          instructionChunk4={suggestion.meal_formatted_instructions[3]?.title}
          instructionChunk5={suggestion.meal_formatted_instructions[4]?.title}
          instructionChunk6={suggestion.meal_formatted_instructions[5]?.title}
          instructionChunk1Step={
            suggestion.meal_formatted_instructions[0]?.instructionSteps
          }
          instructionChunk2Step={
            suggestion.meal_formatted_instructions[1]?.instructionSteps
          }
          instructionChunk3Step={
            suggestion.meal_formatted_instructions[2]?.instructionSteps
          }
          instructionChunk4Step={
            suggestion.meal_formatted_instructions[3]?.instructionSteps
          }
          instructionChunk5Step={
            suggestion.meal_formatted_instructions[4]?.instructionSteps
          }
          instructionChunk6Step={
            suggestion.meal_formatted_instructions[5]?.instructionSteps
          }
          instructionChunk1DataName={
            suggestion.meal_formatted_instructions[0]?.dataName
          }
          instructionChunk2DataName={
            suggestion.meal_formatted_instructions[1]?.dataName
          }
          instructionChunk3DataName={
            suggestion.meal_formatted_instructions[2]?.dataName
          }
          instructionChunk4DataName={
            suggestion.meal_formatted_instructions[3]?.dataName
          }
          instructionChunk5DataName={
            suggestion.meal_formatted_instructions[4]?.dataName
          }
          instructionChunk6DataName={
            suggestion.meal_formatted_instructions[5]?.dataName
          }
          chunk1Content={suggestion?.meal_image_or_video_content1}
          chunk2Content={suggestion?.meal_image_or_video_content2}
          chunk3Content={suggestion?.meal_image_or_video_content3}
          chunk4Content={suggestion?.meal_image_or_video_content4}
          chunk5Content={suggestion?.meal_image_or_video_content5}
          chunk6Content={suggestion?.meal_image_or_video_content6}
          instructionWordlength={suggestion?.instructionWordlength}
          tips={suggestion?.meal_tips}
          mealImageData={suggestion?.itemImage0}
          suggested={true}
          id={suggestion._id}
          categories={suggestion?.item_categories?.map(
            (ele) => ele?.category_name
          )}
          ingredientGroupList={suggestion.formatted_ingredients}
        />
      )}

      {openModal2 && (
        <Popup1
          popup="product"
          openModal={openModal2}
          closeModal={closeModal}
          name={suggestion.meal_name}
          description={suggestion.item_name}
          itemType={suggestion?.item_type}
          imageData={suggestion.item_images}
          image={suggestion.item_images[0]}
          intro={suggestion?.item_intro}
          // imagesData={suggestion.product_images.slice(1)}
          categories={suggestion?.item_categories?.map(
            (ele) => ele?.category_name
          )}
          sizesList={suggestion?.product_size}
          ingredientsList={
            suggestion.formatted_ingredients?.length
              ? suggestion.formatted_ingredients
              : []
          }
          suggested={true}
          id={suggestion._id}
          ingredientGroupList={suggestion.formatted_ingredients}
          item_description={suggestion?.item_description.map(
            (ele) => ele?.formatted_string
          )}
          ingredientsInItem={suggestion?.ingredeints_in_item?.map(
            (ele) => ele?.formatted_string_of_item
          )}
          ingredientList={suggestion?.ingredeints_in_item?.map(
            (ele) => ele?.formatted_string_of_item
          )}
        />
      )}

      {addPublicMeal && (
        <div className={styles.addpublicMeal_container}>
          <div className={styles.addpublicMeal}>
            <div className={styles.addpublicMeal_top}>
              <h2>Add meal from the store</h2>
              <div onClick={togglePublicMeal}>
                <CloseFillIcon style={styles.addpublicMeal_top_close} />
              </div>
            </div>
            <div className={styles.search_con2}>
              <div className={styles.select_container}>
                <div onClick={toggleSearchOption} className={styles.select_box}>
                  <p>{searchType}</p>
                  <ArrowDropDownIcon className={styles.select_box_icon} />
                </div>
                {searchOption && (
                  <div className={styles.select_options}>
                    <p onClick={() => handleSearchType("Meal")}>Meals</p>
                    <p onClick={() => handleSearchType("Product")}>Products</p>
                    <p onClick={() => handleSearchType("Kitchen Utensil")}>
                      Kitchen Utensils
                    </p>
                    <p onClick={() => handleSearchType("Category")}>Category</p>
                  </div>
                )}
              </div>
              <div onClick={toggleSearch} className={styles.search_box}>
                <p className={styles.search_icon}>
                  <SearchIcon className={styles.search_icon} />
                </p>
                <input
                  type="text"
                  name="search"
                  onChange={handleSearchPublicSuggestion}
                  className={styles.search_input}
                  placeholder="Search for products"
                />
                {search && (
                  <div className={styles.search_container}>
                    <div className={styles.search_container_col_1}>
                      <div className={styles.search_suggestion}>
                        <h3 className={styles.search_suggestion_h3}>
                          Meals{" "}
                          {searchType === "Meal" &&
                            "(" + publicSuggestions.length + ")"}
                        </h3>
                        {searchType === "Meal" && (
                          <ul className={styles.search_help_lists}>
                            {publicSuggestions.map((suggestion) => {
                              return (
                                <li
                                  onClick={() => addSuggestion(suggestion)}
                                  className={styles.search_help_list}
                                >
                                  {suggestion.meal_name}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>

                      <div className={styles.search_container_col_2}>
                        <div className={styles.search_container_col_2_row_1}>
                          <h3 className={styles.search_products_h3}>
                            Products{" "}
                            {searchType === "Product" &&
                              "(" + publicSuggestions.length + ")"}
                          </h3>
                        </div>
                        <div className={styles.search_container_col_2_row_2}>
                          <div className={styles.searched_products}>
                            <ul className={styles.search_help_lists}>
                              {searchType === "Product" && (
                                <>
                                  {publicSuggestions.map((suggestion) => {
                                    return (
                                      <li
                                        onClick={() =>
                                          addSuggestion(suggestion)
                                        }
                                        className={styles.search_help_list}
                                      >
                                        {suggestion.product_name}
                                      </li>
                                    );
                                  })}
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className={styles.search_help}>
                        <h3 className={styles.search_help_h3}>
                          Kitchen Utensils{" "}
                          {searchType === "Kitchen Utensils" &&
                            "(" + publicSuggestions.length + ")"}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.search_button}>Search</div>
            </div>
          </div>
        </div>
      )}

      <TransferToInventory
        type={searchType}
        setTransferToInventoryState={setTransferToInventoryState}
        meal={suggestion}
        transferToInventory={transferToInventory}
        reloadData={getUserItems}
        toggleTransferToInventory={toggleTransferToInventory}
      />

      {sent && <Sent toggleSent={toggleSent} />}
    </div>
  );
};

// export default SuggestedMeals

function mapStateToProp(state) {
  return {
    auth: state.Auth,
  };
}

export default connect(mapStateToProp)(SuggestedMeals);
