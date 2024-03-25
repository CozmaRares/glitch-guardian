import { validateRequest } from "@/server/auth";
import Avatar from "./utils/Avatar";
import { type User } from "lucia";
import { Button } from "./ui/button";
import { Settings } from "lucide-react";
import ActivePageProvider from "@/context/active-page";
import Menu from "./Menu";
import { actionMenus, mainMenu } from "@/lib/data";

export default async function AsideMenu() {
  const { user } = (await validateRequest()) as { user: User };

  return (
    <aside className="max-h-screen min-h-screen w-full max-w-full space-y-16 overflow-y-scroll border-r p-4 pt-8">
      <div>
        <h2 className="text-3xl">
          <span className="inline-block rounded-lg text-primary">Glitch</span>
          Guardian
        </h2>
        <p className="text-sm">Seamless bug tracking</p>
      </div>

      <div className="grid grid-cols-[auto,minmax(0,1fr),auto] grid-rows-2 items-center gap-x-5 rounded-md border-2 p-3">
        {/* TODO: add file storage */}
        <Avatar
          size={50}
          username={user.username}
          imageUrl="/placeholder.jpeg"
          className="row-span-full"
        />
        <span className="max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-xl text-primary">
          {user.username}
        </span>
        <Button className="group col-start-3 row-span-full aspect-square bg-background p-0 text-foreground">
          <Settings className="transition-transform duration-300 group-hover:rotate-[360deg]" />
        </Button>
        <span className="max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
          {/* TODO: add user email*/}
          fake@email.com
        </span>
      </div>

      <ActivePageProvider>
        <nav>
          <Menu
            label="menu"
            entries={mainMenu}
          />
          <Menu
            label="actions"
            entries={actionMenus[user.userRole]}
          />
        </nav>
      </ActivePageProvider>
    </aside>
  );
}
