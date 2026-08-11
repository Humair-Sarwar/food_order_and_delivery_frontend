import React, { useState, useMemo } from "react";
import {
  Edit2,
  Trash2,
  Eye,
  Utensils,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  GenericTable,
  type Column,
} from "../../../components/common/GenericTable";
import ConfirmDeleteModal from "../../../components/common/ConfirmDeleteModal";
import Button from "../../../components/common/Button";
import Pagination from "../../../components/common/Pagination";
import {
  useFoodItemDelete,
  useFoodItems,
  useFoodItemStatusUpdate,
} from "../../../hooks/admin/useFoodItem";
import { Switch } from "../../../components/common/Switch";
import { useNavigate } from "react-router-dom";

export interface FoodItem {
  id: string;
  title: string;
  slug: string;
  is_on_sale: number;
  sale_price: number | null;
  regular_price: number | null;
  sku: string | null;
  category_id: string;
  category_title?: string;
  restaurant_id?: string;
  restaurant_name: string;
  is_available: boolean;
  description: string | null;
  media?: {
    media_path: string;
  } | null;
  is_published: number;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  restaurant?: {
    id: string;
    name: string;
  };
  category?: {
    id: string;
    title: string;
  };
  image?: {
    id: string;
    media_path: string;
  } | null;
}

export const FoodItems: React.FC = () => {
  // --- Pagination States ---
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  // --- Filter States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // --- Modal & Utility States ---
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFoodItemId, setSelectedFoodItemId] = useState<string | null>(
    null,
  );

  // --- Dynamic API Hook Integration ---
  const { data, isLoading } = useFoodItems({
    page,
    per_page: perPage,
    search_by_title: searchQuery || undefined,
    search_by_category: selectedCategory || undefined,
    search_by_restaurant: selectedRestaurant || undefined,
    search_item_available: selectedAvailability || undefined,
    search_product_status: selectedStatus || undefined,
  });

  const { mutate: deleteFoodItem, isPending: isDeletePending } =
    useFoodItemDelete();
  const { mutate: updateStatus, isPending: isStatusPending } =
    useFoodItemStatusUpdate();

  const foodItemsList: FoodItem[] = data?.data || [];

  // --- Derived Categories Extract for Filter Dropdown ---
  const uniqueCategories = useMemo(() => {
    const categoriesMap = new Map<string, string>();
    foodItemsList.forEach((item) => {
      if (item.category_id && item.category_title) {
        categoriesMap.set(item.category_id, item.category_title);
      }
    });
    return Array.from(categoriesMap.entries()).map(([id, title]) => ({
      id,
      title,
    }));
  }, [foodItemsList]);

  const uniqueRestaurants = data?.restaurants || [];
  const navigation = useNavigate();
  // --- Action Handlers ---
  const handleAddNew = () => {
    navigation("/admin/food-items/create");
  };

  const handleEdit = (item: FoodItem) => {
    navigation(`/admin/food-items/update/${item?.id}`);
  };

  const handleView = (item: FoodItem) => {};

  const handleDeleteTrigger = (id: string) => {
    setSelectedFoodItemId(id);
    setIsDeleteOpen(true);
  };

  const handleToggleStatus = (item: FoodItem) => {
    const nextStatus = item.is_published === 1 ? "draft" : "published";

    updateStatus(
      {
        id: item.id,
        data: { is_published: !nextStatus },
      },
      {
        onSuccess: (response: any) => {
          toast.success(
            response?.message ||
              `${item.title} visibility status shifted to ${nextStatus}.`,
          );
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message ||
              err?.message ||
              `Failed to update visibility status for ${item.title}.`,
          );
        },
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!selectedFoodItemId) return;

    deleteFoodItem(selectedFoodItemId, {
      onSuccess: () => {
        toast.success("Food item successfully removed from menu.");
        setIsDeleteOpen(false);
        setSelectedFoodItemId(null);
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to remove the food item. Please try again.",
        );
      },
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedRestaurant("");
    setSelectedAvailability("");
    setSelectedStatus("");
    setPage(1);
  };

  // --- Generic Table Column Structure Definition ---
  const columns: Column<FoodItem>[] = [
    {
      header: "Title",
      className: "w-4/12 min-w-[240px]",
      render: (item) => {
        const hasImage = item.image && item.image.media_path;
        const imageUrl = hasImage
          ? `${import.meta.env.VITE_API_BASE_URL}/storage/${item?.image?.media_path}`
          : null;

        return (
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 min-w-[36px] rounded-xl overflow-hidden border border-gray-200/60 bg-gray-50 flex items-center justify-center shadow-inner group-hover:border-orange-200/70 transition-colors duration-300 shrink-0">
              {hasImage ? (
                <img
                  src={imageUrl!}
                  alt={item.title}
                  className="h-full w-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <Utensils
                  size={15}
                  className="text-gray-400 stroke-[1.8] group-hover:text-orange-500 transition-colors"
                />
              )}
            </div>
            <div className="flex flex-col min-w-0 overflow-hidden">
              <span className="text-sm font-semibold text-gray-900 group-hover:text-orange-500 transition-colors truncate">
                {item.title}
              </span>
              <span className="text-[10px] font-medium text-gray-400 mt-0.5 tracking-wide truncate">
                {item.slug ? `/${item.slug}` : "/root-slug"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Category",
      className: "w-2/12",
      render: (item) => (
        <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wide bg-gray-100 text-gray-600 rounded-lg whitespace-nowrap border border-gray-200/30">
          {item?.category?.title || "Unassigned"}
        </span>
      ),
    },
    {
      header: "Restaurant",
      className: "w-2/12 text-gray-700 font-medium text-xs",
      accessorKey: "restaurant_name",
      render: (item) => (
        <span className="text-[13px] tracking-wid whitespace-nowrap">
          {item?.restaurant?.name || "Unassigned"}
        </span>
      ),
    },
    {
      header: "Price",
      className: "w-2/12",
      render: (item) => (
        <div className="flex flex-col">
          {item?.is_on_sale && !(item?.regular_price == item?.sale_price) ? (
            <>
              <span className="text-orange-600 font-bold">
                Rs. {item.sale_price}
              </span>
              <span className="text-[10px] text-gray-400 line-through">
                Rs. {item.regular_price}
              </span>
            </>
          ) : (
            <span className="font-semibold text-gray-900">
              Rs. {item.regular_price}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Available",
      className: "w-1/12",
      render: (item) => (
        <span
          className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-md ${
            item?.is_available
              ? "bg-emerald-50 text-emerald-600"
              : "bg-rose-50 text-rose-600"
          }`}
        >
          {item?.is_available ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Draft/Published",
      className: "w-2/12 hidden md:table-cell",
      render: (item) => (
        <div className="flex items-center gap-3">
          <Switch
            checked={item?.is_published == 1}
            onChange={() => handleToggleStatus(item)}
          />
          <span
            className={`text-[10px] font-bold tracking-wider ${
              item.is_published === 1 ? "text-orange-600" : "text-gray-400"
            }`}
          >
            {item.is_published ? "Published" : "Draft"}
          </span>
        </div>
      ),
    },
    {
      header: <div className="text-right">Actions</div>,
      className: "w-2/12 text-right",
      render: (item) => (
        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleView(item)}
            title="View Details"
            className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-gray-100 text-gray-500 hover:text-orange-600 hover:bg-orange-50 hover:border-orange-100 bg-gray-50/50 shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
          >
            <Eye size={14} className="stroke-[2]" />
          </button>
          <button
            onClick={() => handleEdit(item)}
            title="Edit Item"
            className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-gray-100 text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 bg-gray-50/50 shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
          >
            <Edit2 size={14} className="stroke-[2]" />
          </button>
          <button
            onClick={() => handleDeleteTrigger(item.id)}
            title="Delete Item"
            className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-gray-100 text-gray-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 bg-gray-50/50 shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
          >
            <Trash2 size={14} className="stroke-[2]" />
          </button>
        </div>
      ),
    },
  ];

  // --- Skeleton Loading Component Matrix ---
  const TableSkeleton = () => (
    <div className="w-full space-y-4 animate-pulse">
      {[...Array(perPage)].map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl gap-4"
        >
          <div className="flex items-center gap-3 w-4/12">
            <div className="h-9 w-9 bg-gray-200 rounded-xl shrink-0" />
            <div className="flex flex-col gap-2 w-full">
              <div className="h-4 bg-gray-200 rounded-md w-3/4" />
              <div className="h-3 bg-gray-150 rounded-md w-1/2" />
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded-md w-2/12 hidden sm:block" />
          <div className="h-4 bg-gray-200 rounded-md w-2/12 hidden md:block" />
          <div className="h-4 bg-gray-200 rounded-md w-1/12" />
          <div className="h-4 bg-gray-200 rounded-md w-1/12" />
          <div className="h-6 bg-gray-200 rounded-lg w-2/12 hidden md:block" />
          <div className="flex justify-end gap-2 w-2/12">
            <div className="h-8 w-8 bg-gray-200 rounded-xl" />
            <div className="h-8 w-8 bg-gray-200 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );

  const isFiltered =
    searchQuery !== "" ||
    selectedCategory !== "" ||
    selectedRestaurant !== "" ||
    selectedAvailability !== "" ||
    selectedStatus !== "";

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6 min-h-full">
        <div className="space-y-6 context-fade-in">
          {/* Top Title Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight sm:text-2xl">
                Menu & Food Items
              </h1>
              <p className="text-xs font-medium text-gray-500 mt-0.5">
                Manage your catalog pricing, restaurant mappings, dynamic
                discounts, and status node toggles.
              </p>
            </div>
            <Button label="Add Food Item" onClick={handleAddNew} />
          </div>

          {/* Premium Filter Utility Architecture */}
          <div className="flex flex-col gap-4 p-4 bg-gray-50/60 rounded-2xl border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
              {/* Search Control */}
              <div className="relative lg:col-span-1">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search item title..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="w-full text-xs font-medium pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500/80 focus:ring-2 focus:ring-orange-500/10 placeholder-gray-400/90 transition-all shadow-sm"
                />
              </div>

              {/* Restaurant Filter */}
              <div className="relative">
                <select
                  value={selectedRestaurant}
                  onChange={(e) => {
                    setSelectedRestaurant(e.target.value);
                    setPage(1);
                  }}
                  className="w-full appearance-none text-xs font-semibold px-4 py-2.5 pr-8 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500/80 transition-all cursor-pointer shadow-sm text-gray-700"
                >
                  <option value="">All Restaurants</option>
                  {uniqueRestaurants.map((res: any) => (
                    <option key={res.id} value={res.id}>
                      {res.name}
                    </option>
                  ))}
                </select>
                <SlidersHorizontal
                  size={12}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full appearance-none text-xs font-semibold px-4 py-2.5 pr-8 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500/80 transition-all cursor-pointer shadow-sm text-gray-700"
                >
                  <option value="">All Categories</option>
                  {uniqueCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
                <SlidersHorizontal
                  size={12}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>

              {/* Availability Filter */}
              <div className="relative">
                <select
                  value={selectedAvailability}
                  onChange={(e) => {
                    setSelectedAvailability(e.target.value);
                    setPage(1);
                  }}
                  className="w-full appearance-none text-xs font-semibold px-4 py-2.5 pr-8 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500/80 transition-all cursor-pointer shadow-sm text-gray-700"
                >
                  <option value="">All Availability</option>
                  <option value="available">Available</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
                <SlidersHorizontal
                  size={12}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setPage(1);
                  }}
                  className="w-full appearance-none text-xs font-semibold px-4 py-2.5 pr-8 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500/80 transition-all cursor-pointer shadow-sm text-gray-700"
                >
                  <option value="">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
                <SlidersHorizontal
                  size={12}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Clear Filters Reset Button */}
            {isFiltered && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl border border-gray-200 bg-white transition-all cursor-pointer self-start"
              >
                <X size={13} className="stroke-[2.5]" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Conditional Layout Switching: Loading Skeleton vs Active Data Grid */}
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <GenericTable
              data={foodItemsList}
              columns={columns}
              rowKey={(item) => item.id}
              emptyMessage={
                isFiltered
                  ? "No items match your active filter configurations."
                  : "Your digital menu catalog is currently empty."
              }
              iconNo={
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-50 text-orange-500">
                  <Utensils size={24} className="stroke-[1.8]" />
                </div>
              }
            />
          )}
        </div>
      </div>

      {/* Dynamic Pagination Architecture Integration */}
      {!isLoading && foodItemsList?.length > 0 && (
        <Pagination
          currentPage={data?.pagination?.current_page ?? 1}
          totalPages={data?.pagination?.last_page ?? 1}
          totalEntries={data?.pagination?.total ?? 0}
          from={data?.pagination?.from ?? 0}
          to={data?.pagination?.to ?? 0}
          entriesPerPage={data?.pagination?.per_page ?? perPage}
          onPageChange={(pageNumber) => setPage(pageNumber)}
          onEntriesPerPageChange={(perPageNumber) => {
            setPerPage(perPageNumber);
            setPage(1);
          }}
        />
      )}

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        isLoading={isDeletePending}
        onClose={() => {
          if (isDeletePending) return;
          setIsDeleteOpen(false);
          setSelectedFoodItemId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Remove Item From Menu?"
        message="Are you completely sure you want to drop this culinary node? This will isolate its record mapping across the kitchen ecosystem."
      />
    </>
  );
};

export default FoodItems;
