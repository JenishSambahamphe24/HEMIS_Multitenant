
import {
    Menu,
    MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function DropdownMenu({
    isDropdownOpen,
    handleCloseDropdownMenu,
    reports,
    anchorEl,
    isTargetBlank = false,
    isReportActive // Add this new prop
}) {
    const { currentUser } = useSelector((state) => state.user);
    const roleName = currentUser?.listUser?.[0]?.roleName || currentUser?.role;

    const isDisabled = (module) => {
        return module.disabledRoles.includes(roleName || '');
    };

    return (
        <Menu
            sx={{ mt: "15px", }}
            id="menu-appbar"
            anchorEl={anchorEl} // Use the actual DOM element
            anchorOrigin={{
                vertical: "bottom", // Changed from "top" to "bottom"
                horizontal: "left",  // Changed from "right" to "left"
            }}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            open={Boolean(isDropdownOpen)}
            onClose={handleCloseDropdownMenu}
        >
            {reports.map((item, index) => {
                const disabled = isDisabled(item);
                const isActive = isReportActive ? isReportActive(item.link) : false;
                
                return (
                    !disabled && (
                        <MenuItem
                            sx={{ 
                                padding: "0",
                                backgroundColor: isActive ? 'rgba(43, 110, 181, 0.1)' : 'transparent',
                                borderLeft: isActive ? '1px solid #2b6eb5' : 'none',
                                '&:hover': {
                                    backgroundColor: 'rgba(43, 110, 181, 0.05)',
                                }
                            }}
                            key={index}
                            onClick={handleCloseDropdownMenu}
                        >
                            <Link
                                target={isTargetBlank ? '_blank' : '_parent'}
                                to={item.link}
                                className={`w-[100%] p-[10px] align-left ${
                                    isActive 
                                        ? 'text-[#2b6eb5] font-medium' 
                                        : 'text-black hover:text-[#2b6eb5]'
                                }`}
                            >
                                {item.title}
                            </Link>
                        </MenuItem>
                    )
                );
            })}
        </Menu>
    );
}

