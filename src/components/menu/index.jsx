import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
    Badge,
} from "@nextui-org/react";
import { Icon } from "@iconify-icon/react";

export default function Menu() {
    return (
        <Navbar
            isBordered
            classNames={{
                base: "top-6 fixed",
            }}
        >
            <NavbarBrand>
                <Icon
                    icon="fluent-mdl2:rust-language-logo"
                    width={35}
                    className="mr-1"
                />
                <Icon icon="tabler:hexagon-letter-t" />
                <Icon icon="tabler:hexagon-letter-o" />
                <Icon icon="tabler:hexagon-letter-o" />
                <Icon icon="tabler:hexagon-letter-l" />
            </NavbarBrand>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Badge
                        content="99+"
                        shape="circle"
                        color="danger"
                        size="sm"
                    >
                        <Button radius="full" isIconOnly variant="light">
                            <Icon
                                icon="material-symbols:notifications-outline"
                                width={20}
                            />
                        </Button>
                    </Badge>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
