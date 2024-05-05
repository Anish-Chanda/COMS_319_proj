import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import UserPlantList from "./UserPlantList";
import PlantDetails from "./PlantDetails";
import PlantCard from "./PlantCard";

const user = {
  name: "Anish",
  email: "anish@gmail.com",
  imageUrl:
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQvHrnHN0v6cH0v_YgxmgUkpdN_RzVyB-lnNdpXwzuhymjuoi0NdgcnMHbk8nAwKGb-ISVxVQ",
};
const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Plants Wiki", href: "#", current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard({ userId, isAdmin }) {
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [view, setView] = useState("dashboard");
  const [allPlants, setAllPlants] = useState([]);
  const [isAddingNewPlant, setIsAddingNewPlant] = useState(false);

  const fetchUserPlants = () => {
    fetch(`http://localhost:8080/user/${userId}/plants`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPlants(data.plants);
      });
  };

  const handleNewPlantSubmit = async (event) => {
    event.preventDefault();
    const newPlant = {
      name: event.target.name.value,
      scientific_name: event.target.scientific_name.value,
      type: event.target.type.value,
      soil_mix: event.target.soil_mix.value,
      flowers: event.target.flowers.value,
      fruits: event.target.fruits.value,
      zone: event.target.zone.value,
      sunlight: event.target.sunlight.value,
      img: event.target.img.value,
    };
    addToAllPlants(newPlant);
    setIsAddingNewPlant(false);
  };

  const handleDelete = async (plantId) => {
    console.log("deleting plant..." + plantId);
    //console.log({ plantId });
    try {
      await axios.delete(`http://localhost:8080/plants/${plantId}`);
      setAllPlants(allPlants.filter((plant) => plant._id !== plantId));
    } catch (error) {
      console.error("Error deleting plant", error);
    }
  };

  const addToAllPlants = async (newPlant) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/plants/add",
        newPlant
      );
      setAllPlants([...allPlants, response.data]);
    } catch (error) {
      console.error("Error adding plant", error);
    }
  };

  async function fetchPlants(type) {
    console.log("fetching all plants....");
    try {
      let res;
      if (type === undefined) {
        res = await fetch("http://localhost:8080/plants");
      } else {
        res = await fetch(`http://localhost:8080/plants?type=${type}`);
      }
      const plants = await res.json();
      setAllPlants(plants["plants"]);
    } catch (e) {
      console.log(e);
    }
  }

  const handlePlantUpdate = (updatedPlant) => {
    setAllPlants(
      allPlants.map((plant) => {
        console.log("found match while updating plant...");
        return plant._id === updatedPlant._id ? updatedPlant : plant;
      })
    );
  };

  useEffect(() => {
    if (view === "plantswiki") {
      fetchPlants();
    }
  }, [view]);

  useEffect(() => {
    fetchUserPlants();
  }, []);

  return (
    <>
      <div className="w-full flex flex-col justify-center bg-white h-lvh">
        <div className="h-full flex-1 flex-col justify-center">
          <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
              <>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-8 w-8"
                          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                          alt="Your Company"
                        />
                      </div>
                      <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                          {navigation.map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              onClick={() => {
                                console.log(
                                  "setting view to " +
                                    item.name.toLowerCase().replace(" ", "")
                                );
                                return setView(
                                  item.name.toLowerCase().replace(" ", "")
                                );
                              }}
                              className={classNames(
                                item.name.toLowerCase().replace(" ", "") ===
                                  view
                                  ? "bg-gray-900 text-white"
                                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                "rounded-md px-3 py-2 text-sm font-medium"
                              )}
                              // aria-current={item.name.toLowerCase().replace(" ", "") === "" ? "page" : undefined}
                            >
                              {item.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-4 flex items-center md:ml-6">
                        <button
                          type="button"
                          className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                          <span className="sr-only">View notifications</span>
                          <BellIcon className="h-6 w-6" aria-hidden="true" />
                        </button>

                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3">
                          <div>
                            <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                              <span className="sr-only">Open user menu</span>
                              <img
                                className="h-8 w-8 rounded-full"
                                src={user.imageUrl}
                                alt=""
                              />
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {userNavigation.map((item) => (
                                <Menu.Item key={item.name}>
                                  {({ active }) => (
                                    <a
                                      href={item.href}
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}
                                    >
                                      {item.name}
                                    </a>
                                  )}
                                </Menu.Item>
                              ))}
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                      {/* Mobile menu button */}
                      <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XMarkIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        ) : (
                          <Bars3Icon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="md:hidden">
                  <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                    {navigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        onClick={() => {
                          console.log(
                            "setting view to " +
                              item.name.toLowerCase().replace(" ", "")
                          );
                          return setView(
                            item.name.toLowerCase().replace(" ", "")
                          );
                        }}
                        className={classNames(
                          item.name.toLowerCase().replace(" ", "") === view
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                  <div className="border-t border-gray-700 pb-3 pt-4">
                    <div className="flex items-center px-5">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.imageUrl}
                          alt=""
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium leading-none text-white">
                          {user.name}
                        </div>
                        <div className="text-sm font-medium leading-none text-gray-400">
                          {user.email}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-3 space-y-1 px-2">
                      {userNavigation.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                        >
                          {item.name}
                        </Disclosure.Button>
                      ))}
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          <header className="bg-white shadow">
            <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
              {view === "dashboard" && (
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  My Plants
                </h1>
              )}
              {view === "plantswiki" && (
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  Plants Wiki
                </h1>
              )}
            </div>
          </header>
          <main>
            <div className="mx-auto py-6 sm:px-6 lg:px-8">
              {/* content */}
              {view === "dashboard" && (
                <div className="mx-auto max-w-screen-2xl py-6 sm:px-6 lg:px-8">
                  <div style={{ display: "flex" }}>
                    <div style={{ flex: "1" }}>
                      <UserPlantList
                        userId={userId}
                        plants={plants}
                        setPlants={setPlants}
                        fetchUserPlants={fetchUserPlants}
                        setSelectedPlant={setSelectedPlant}
                      />
                    </div>
                    <div className="border-l border-gray-300 h-lvh mx-2"></div>
                    <div style={{ flex: "2" }}>
                      {/* Your larger section content */}
                      <PlantDetails selectedPlant={selectedPlant} />
                    </div>
                  </div>
                </div>
              )}
              {view === "plantswiki" && (
                <div className="mx-auto max-w-screen-2xl py-6 sm:px-6 lg:px-8">
                  <button onClick={() => setIsAddingNewPlant(true)}>
                    Add New Plant
                  </button>
                  {isAddingNewPlant && (
                    <form onSubmit={handleNewPlantSubmit}>
                      <input name="name" required placeholder="Name" />
                      <input
                        name="scientific_name"
                        required
                        placeholder="Scientific Name"
                      />
                      <input name="type" required placeholder="Type" />

                      {/* <input name="water" required placeholder="Water" /> */}
                      <input name="soil_mix" required placeholder="soil_mix" />
                      <input name="flowers" required placeholder="flowers" />
                      <input
                        name="fruits"
                        required
                        placeholder="fruits (edible?)"
                      />
                      <input name="zone" required placeholder="zone" />
                      <input name="sunlight" required placeholder="sunlight" />
                      <input name="img" required placeholder="image url" />
                      <button type="submit">Submit</button>
                    </form>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
                    {allPlants.map((plant) => (
                      <PlantCard
                        key={plant.id}
                        plant={plant}
                        onPlantUpdate={handlePlantUpdate}
                        handleDelete={handleDelete}
                        isAdmin={isAdmin}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
