import { Link as MuiLink, type LinkProps } from "@mui/material";
import { createLink } from "@tanstack/react-router";

function MuiLinkBase(props: LinkProps) {
  return <MuiLink {...props} />;
}

export const LinkRouter = createLink(MuiLinkBase);
