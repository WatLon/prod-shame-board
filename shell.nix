{pkgs ? import <nixpkgs> {}}: let
  packages = with pkgs; [
    bun
  ];
in
  with pkgs;
    mkShell {
      name = "prod-shame-board";
      buildInputs = packages;

      DIRENV_LOG_FORMAT = "";
    }
