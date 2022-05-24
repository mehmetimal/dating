import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {IFavoriteUser} from '../../../../../model/favorite-user.model';
import {Router} from '@angular/router';
import {UserService} from '../../../../../services/user.service';
import * as moment from 'moment';
import {FavoriteUserService} from '../../../../../services/favorite-user.service';
import {IUser} from '../../../../../model/user.model';
import {ISharedImage} from '../../../../../model/shared-image.model';
import {AcceptStateEnum} from '../../../../../model/accept-state.enum';
import {TokenService} from '../../../../../services/token.service';
import {SharedImageService} from '../../../../../services/shared-image.service';

@Component({
  selector: 'app-favorite-list',
  templateUrl: './favorite-list.component.html',
  styleUrls: ['./favorite-list.component.scss']
})
export class FavoriteListComponent implements OnInit {
  public udcFolder = environment.udcFolder;
  public backendURL = environment.url;
  public isFavorite = false;
  public favoriteUsers: IFavoriteUser[];
  public selectedFovariteUser: IFavoriteUser;

  sharedImagesWithCurrentUser: ISharedImage[];
  public approved = AcceptStateEnum.APPROVED;

  constructor(private router: Router,
              private userService: UserService,
              private tokenService: TokenService,
              private sharedImageService: SharedImageService,
              private favoriteUserService: FavoriteUserService) {
  }

  ngOnInit() {
    this.findAllSharedImagesWithCurrentUser();
    this.initaizeForm();
  }

  goToUserProfile(name) {
    document.getElementById('closeModal').click();
    this.router.navigateByUrl(`view/${name}`);
  }

  goToMessage(user) {
    document.getElementById('closeModal').click();
    const convertUser = JSON.stringify(user);
    this.router.navigateByUrl('/messages', {state: {data: convertUser}});

  }

  initFavorite(userId: any) {
    this.isFavorite = false;
    this.favoriteUsers.forEach((result) => {
      if (result.user._id === userId) {
        this.isFavorite = true;
        this.selectedFovariteUser = result;
      }
    });
  }

  favoriteUserAdded(user) {
    this.userService.favoriteUser(user).subscribe((data) => {
    });
  }

  favoriteUserDelete() {
    this.userService.favoriteUserDelete(this.selectedFovariteUser).subscribe((data) => {
    });
  }

  initaizeForm() {
    this.favoriteUserService.findFavoriteUsersOfCurrentUser().subscribe((data: any) => {
      this.favoriteUsers = data.body.response;
    });
  }

  isCurrentUserBlockList(user: IUser) {
    const currentUser = this.tokenService.getPayload();
    let blockListUser;
    if (user.blockUserList && user.blockUserList.length > 0) {
      blockListUser = user.blockUserList.find(value => value._id === currentUser._id);
    }
    return blockListUser ? true : false;
  }

  isSharedProfileImageWithCurrentUser(user: IUser) {
    const currentUser = this.tokenService.getPayload();
    let sharedUser;
    if (this.sharedImagesWithCurrentUser && this.sharedImagesWithCurrentUser.length > 0) {
      sharedUser = this.sharedImagesWithCurrentUser.find(value => value.toUser === currentUser._id
          && user && user.profileImage && value.image === user.profileImage._id);
    }
    return sharedUser || (user && user.profileImage && user.profileImage.isBlurRemoved) ? true : false;
  }

  findAllSharedImagesWithCurrentUser() {
    this.sharedImageService.findAllSharedImagesWithCurrentUser().subscribe((value: any) => {
      this.sharedImagesWithCurrentUser = value.body;
    });
  }

}
