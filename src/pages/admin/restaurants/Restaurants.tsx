import React, { useState } from "react";
import {
  Utensils,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Edit2,
  UtensilsCrossed,
} from "lucide-react";
import {
  GenericTable,
  type Column,
} from "../../../components/common/GenericTable";
import { Switch } from "../../../components/common/Switch";
import { SearchInput } from "../../../components/admin/SearchInput";
import { Select, type SelectOption } from "../../../components/common/Select";
import Button from "../../../components/common/Button";
import {
  useRestaurantDelete,
  useRestaurantFetch,
  useRestaurantStatus,
} from "../../../hooks/admin/useRestaurant";
import Pagination from "../../../components/common/Pagination";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "../../../components/common/ConfirmDeleteModal";
import {
  RestaurantFormModal,
  type RestaurantFormData,
} from "./RestaurantFormModal";

interface Restaurant {
  id: string;
  name: string;
  logo: string;
  owner: string;
  email: string;
  cuisine: string;
  orders: number;
  rating: number;
  status: string;
}

const Restaurants: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantFormData | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false); // Track read-only state lifecycle
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(15);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    string | null
  >(null);

  const { data, isPending } = useRestaurantFetch({
    page,
    per_page,
    search: searchQuery,
    status: statusFilter === "All" ? "" : statusFilter,
  });

  const restaurants = data?.data ?? [];
  const { mutate: changeStatus } = useRestaurantStatus();
  const { mutate: deleteRestaurant, isPending: isDeleting } =
    useRestaurantDelete();
  const summaryData = (data as any)?.summary;

  const vendorStats = [
    {
      title: "Total Restaurants",
      count: summaryData?.total_restaurants,
      icon: Utensils,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Active Restaurants",
      count: summaryData?.total_active_restaurants,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Inactive Restaurants",
      count: summaryData?.total_inactive_restaurants,
      icon: AlertCircle,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  // Map common field injection payload
  const mapRestaurantData = (res: any): RestaurantFormData => ({
    id: res.id,
    name: res.name || "",
    email: res.email || "",
    phone: res.phone || "",
    address: res.address || "",
    city: res.city || "",
    logo_id: res.logo?.id || "",
    banner_id: res.banner?.id || "",
    logo: res.logo || null,
    banner: res.banner || null,
    description: res.description || "",
    status: res.status || "inactive",
  });

  // Action node trigger for viewing data
  const handleView = (res: any) => {
    setIsViewOnly(true);
    setSelectedRestaurant(mapRestaurantData(res));
    setIsModalOpen(true);
  };

  const handleEdit = (res: any) => {
    setIsViewOnly(false);
    setSelectedRestaurant(mapRestaurantData(res));
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setIsViewOnly(false);
    setSelectedRestaurant(null);
    setIsModalOpen(true);
  };

  const columns: Column<Restaurant>[] = [
    {
      header: "Restaurant info",
      render: (res: any) => {
        const hasImage = !!res?.logo?.media_path;

        return (
          <div className="flex items-center gap-3">
            {hasImage ? (
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}/storage/${res?.logo?.media_path}`}
                alt={res.name}
                className="w-10 h-10 rounded-xl object-cover border border-gray-100 shadow-inner"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 shadow-inner flex items-center justify-center text-gray-400">
                <Utensils className="w-5 h-5 stroke-[1.8]" />
              </div>
            )}

            <div className="flex flex-col">
              <span className="font-black text-gray-900 group-hover:text-orange-500 transition-colors">
                {res.name}
              </span>
              <span className="text-[10px] font-bold text-gray-400 mt-0.5">
                {res.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Slug",
      render: (res: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-800">{res.owner}</span>
          <span className="text-[12px] font-semibold text-gray-400">
            {res.slug}
          </span>
        </div>
      ),
    },
    {
      header: "Phone",
      render: (res: any) => (
        <span className="px-2 py-1 text-[11px] font-medium bg-gray-100 text-gray-600 rounded-lg whitespace-nowrap">
          {res.phone}
        </span>
      ),
    },
    {
      header: "Total Orders",
      accessorKey: "orders",
      className: "text-center font-extrabold text-gray-900",
      headerClassName: "text-center",
    },
    {
      header: "City",
      render: (res: any) => (
        <span className="px-2 py-1 text-[11px] font-medium bg-gray-100 text-gray-600 rounded-lg whitespace-nowrap">
          {res.city}
        </span>
      ),
    },
    {
      header: "Status Toggle",
      headerClassName: "text-center",
      className: "text-center",
      render: (res: any) =>
        res.status === "Pending" ? (
          <span className="inline-flex items-center px-2 py-0.5 bg-amber-500/10 text-amber-600 border border-amber-500/10 rounded-full text-[10px] font-bold">
            Pending Approval
          </span>
        ) : (
          <div className="flex items-center justify-center">
            <Switch
              checked={res.status === "active"}
              onChange={() =>
                changeStatus(
                  {
                    id: res.id,
                    status: res.status === "active" ? "inactive" : "active",
                  },
                  {
                    onSuccess: (response) => {
                      toast.success(response.message);
                      setPage(1);
                    },
                    onError: (error: any) => {
                      toast.error(
                        error?.response?.data?.message ||
                          "Failed to update status.",
                      );
                    },
                  },
                )
              }
            />
          </div>
        ),
    },
    {
      header: "Actions",
      headerClassName: "text-center",
      className: "text-center",
      render: (res: any) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleView(res)}
            className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-gray-100 text-gray-500 hover:text-orange-600 hover:bg-orange-50 hover:border-orange-100 bg-gray-50/50 shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
            title="View Details"
          >
            <Eye className="w-4 h-4 stroke-[2]" />
          </button>

          <button
            onClick={() => handleEdit(res)}
            className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-gray-100 text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 bg-gray-50/50 shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
            title="Edit Restaurant"
          >
            <Edit2 className="w-4 h-4 stroke-[2]" />
          </button>

          <button
            onClick={() => handleDeleteTrigger(res.id)}
            className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-gray-100 text-gray-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 bg-gray-50/50 shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
            title="Delete Restaurant"
          >
            <Trash2 className="w-4 h-4 stroke-[2]" />
          </button>
        </div>
      ),
    },
  ];

  const skeletonRows = Array.from({ length: per_page }).map((_, index) => ({
    id: `skeleton-${index}`,
    isSkeleton: true,
  }));

  // Re-map column rules safely when background state is pending
  const runningColumns = isPending
    ? columns.map((col) => ({
        ...col,
        accessorKey: undefined, // Skeleton runtime defaults render engine override
        render: () => (
          <div className="animate-pulse py-1 flex items-center justify-center width-full">
            <div className="h-4 bg-gray-200 rounded-md w-2/3 mx-auto" />
          </div>
        ),
        // Base profile column override for visual text context lines
        ...(col.header === "Restaurant info" && {
          render: () => (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-gray-200" />
              <div className="flex flex-col gap-2">
                <div className="h-4 bg-gray-200 rounded-md w-28" />
                <div className="h-3 bg-gray-200 rounded-md w-36" />
              </div>
            </div>
          ),
        }),
        // Actions wrapper structure placeholder skeleton blocks
        ...(col.header === "Actions" && {
          render: () => (
            <div className="flex items-center justify-center gap-2 animate-pulse">
              <div className="h-8 w-8 rounded-xl bg-gray-200" />
              <div className="h-8 w-8 rounded-xl bg-gray-200" />
              <div className="h-8 w-8 rounded-xl bg-gray-200" />
            </div>
          ),
        }),
      }))
    : columns;

  const statusOptions: SelectOption[] = [
    { label: "All Status", value: "" },
    { label: "Active Only", value: "active" },
    { label: "Inactive Only", value: "inactive" },
  ];

  const handleDeleteTrigger = (id: string) => {
    setSelectedRestaurantId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedRestaurantId) return;

    deleteRestaurant(selectedRestaurantId, {
      onSuccess: (res: any) => {
        if (restaurants?.length === 1 && page > 1) {
          setPage(page - 1);
        }
        toast.success(res?.message || "Restaurant deleted successfully!");
        setIsDeleteOpen(false);
        setSelectedRestaurantId(null);
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message ||
            "Failed to remove restaurant registration.",
        );
      },
    });
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6 min-h-full">
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight sm:text-2xl">
                Restaurant Management
              </h1>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">
                Onboard new culinary partners, toggle activation nodes.
              </p>
            </div>
            <Button label="Add New Restaurant" onClick={handleAddNew} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {vendorStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-gray-100 rounded-2xl p-3 flex items-center gap-4 shadow hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 group"
                >
                  {/* Icon Wrapper Node */}
                  <div
                    className={`p-3.5 rounded-xl transition-transform duration-300 group-hover:scale-105 ${stat.color}`}
                  >
                    {isPending ? (
                      // English: Pulse skeleton match for dynamic dimensions
                      <div className="w-5 h-5 bg-gray-300/30 rounded-md animate-pulse" />
                    ) : (
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    )}
                  </div>

                  {/* Content Wrapper Node */}
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-gray-500 tracking-wider select-none">
                      {stat.title}
                    </span>

                    {isPending ? (
                      <div className="h-7 bg-gray-200/80 rounded-md w-16 mt-1 animate-pulse" />
                    ) : (
                      <span className="text-2xl font-extrabold text-gray-800 tracking-tight">
                        {stat.count}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between bg-white border border-gray-200/80 p-3 rounded-2xl shadow-sm">
            <SearchInput
              value={searchQuery}
              onChangeValue={(value) => {
                setSearchQuery(value);
                setPage(1);
              }}
            />
            <Select
              value={statusFilter}
              onChangeValue={setStatusFilter}
              options={statusOptions}
              setPage={setPage}
            />
          </div>

          <GenericTable
            data={isPending ? skeletonRows : restaurants}
            columns={runningColumns as any}
            rowKey={(res: any) => res.id}
            iconNo={<UtensilsCrossed className="w-[40px] h-[40px]" />}
            emptyMessage="No Restaurants Available!"
          />
        </div>
      </div>

      {!isPending && restaurants?.length > 0 && (
        <Pagination
          currentPage={data?.pagination?.current_page}
          totalPages={data?.pagination?.last_page}
          totalEntries={data?.pagination?.total}
          from={data?.pagination.from ?? 0}
          to={data?.pagination.to ?? 0}
          entriesPerPage={data?.pagination?.per_page}
          onPageChange={(page) => setPage(page)}
          onEntriesPerPageChange={(perPage) => {
            setPerPage(perPage);
            setPage(1);
          }}
        />
      )}

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        isLoading={isDeleting}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedRestaurantId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Restaurant?"
        message="Are you sure you want to delete this restaurant?"
      />

      <RestaurantFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedRestaurant}
        isReadOnly={isViewOnly}
      />
    </>
  );
};

export default Restaurants;
