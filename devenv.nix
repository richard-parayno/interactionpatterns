{
  pkgs,
  lib,
  config,
  ...
}:
{
  # https://devenv.sh/packages/
  packages = [
    pkgs.bun
  ];

  enterShell = ''
    bun install
  '';

  # See full reference at https://devenv.sh/reference/options/
}
